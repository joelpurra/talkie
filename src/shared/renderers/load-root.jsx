/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import {
    promiseTry,
} from "../promise";

import ReactDOM from "react-dom";

import {
    dispatchAll,
} from "../utils/store-helpers";

import autoRoot from "./auto-root";

import sharedActions from "../actions";

const getPrerenderActionsToDispatch = (prerenderedActionsToDispatch) => {
    const styleRootActionsToDispatch = [];

    const allActionsToDispatch = []
        .concat(styleRootActionsToDispatch)
        .concat(prerenderedActionsToDispatch);

    return allActionsToDispatch;
};

const getPostrenderActionsToDispatch = (postrenderActionsToDispatch) => {
    // TODO: simplify.
    const styleRootActionsToDispatch = [
        // NOTE: currently attempts to match "synchronous usage" in style-root.jsx.
        // TODO: generalize preloading?
        sharedActions.metadata.loadIsPremium(),
        sharedActions.metadata.loadVersionName(),
        sharedActions.metadata.loadSystemType(),
        sharedActions.metadata.loadOsType(),
    ];

    const allActionsToDispatch = []
        .concat(styleRootActionsToDispatch)
        .concat(postrenderActionsToDispatch);

    return allActionsToDispatch;
};

const renderHtml = (root) => promiseTry(() => {
    const rootElement = document.getElementById("react-root");

    ReactDOM.render(root, rootElement);
});

const hydrateHtml = (rootReducer, customPrerenderedActionsToDispatch, customPostrenderActionsToDispatch, ChildComponent) => promiseTry(() => {
    // NOTE: use preloaded state from the pre-rendered html.
    const prerenderedState = JSON.parse(document.getElementById("__PRERENDERED_STATE__").textContent);
    const prerenderedActionsToDispatch = getPrerenderActionsToDispatch(customPrerenderedActionsToDispatch);
    const postrenderActionsToDispatch = getPostrenderActionsToDispatch(customPostrenderActionsToDispatch);

    return autoRoot(prerenderedState, rootReducer, ChildComponent)
        .then(({
             root,
             store,
           }) => dispatchAll(store, prerenderedActionsToDispatch)
               .then(() => renderHtml(root))
               .then(() => dispatchAll(store, postrenderActionsToDispatch)));
});

export default hydrateHtml;
