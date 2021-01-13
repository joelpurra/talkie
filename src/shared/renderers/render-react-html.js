/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

import ReactDOMServer from "react-dom/server";

import {
    dispatchAll,
} from "../utils/store-helpers";

import autoRoot from "./auto-root";

import sharedActions from "../actions";

const getPrerenderActionsToDispatch = (prerenderedActionsToDispatch) => {
    const serverSideActionsToDispatch = [
        // NOTE: currently attempts to match "synchronous usage" in style-root.jsx.
        // TODO: generalize preloading?
        // NOTE: don't want to keep track of when to load these, preemptively loading.
        sharedActions.metadata.loadIsPremiumEdition(),
        sharedActions.metadata.loadVersionName(),
        sharedActions.metadata.loadSystemType(),
        sharedActions.metadata.loadVersionNumber(),
        sharedActions.voices.loadTranslatedLanguages(),
    ];

    const allActionsToDispatch = []
        .concat(serverSideActionsToDispatch)
        .concat(prerenderedActionsToDispatch);

    return allActionsToDispatch;
};

const getPostrenderActionsToDispatch = (postrenderActionsToDispatch) => {
    // TODO: simplify.
    const styleRootActionsToDispatch = [];

    const allActionsToDispatch = []
        .concat(styleRootActionsToDispatch)
        .concat(postrenderActionsToDispatch);

    return allActionsToDispatch;
};

const EMPTY_STATE = undefined;

const renderHtml = (store, reactHtmlTemplate, localeProvider, styletron, root) => promiseTry(() => {
    const reactRoot = ReactDOMServer.renderToString(root);
    const translationLocale = localeProvider.getTranslationLocale();
    const stylesForHead = styletron.getStylesheetsHtml();
    const prerenderedState = store.getState();

    // WARNING: See the following for security issues around embedding JSON in HTML:
    // https://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
    const prerenderedStateJson = JSON.stringify(prerenderedState).replace(/</g, "\\u003c");

    const html = reactHtmlTemplate({
        locale: translationLocale,
        reactRoot: reactRoot,
        stylesForHead: stylesForHead,
        prerenderedStateJson: prerenderedStateJson,
    });

    return html;
});

const getHtml = (rootReducer, customPrerenderedActionsToDispatch, customPostrenderActionsToDispatch, reactHtmlTemplate, talkieLocale, ChildComponent) => promiseTry(() => {
    const prerenderedActionsToDispatch = getPrerenderActionsToDispatch(customPrerenderedActionsToDispatch);
    const postrenderActionsToDispatch = getPostrenderActionsToDispatch(customPostrenderActionsToDispatch);

    return autoRoot(EMPTY_STATE, rootReducer, ChildComponent)
        .then(({
            root,
            store,
            styletron,
            localeProvider,
        }) => {
            localeProvider.setTranslationLocale(talkieLocale);

            return dispatchAll(store, prerenderedActionsToDispatch)
                .then(() => {
                    let html = null;

                    return renderHtml(store, reactHtmlTemplate, localeProvider, styletron, root)
                        .then((renderedHtml) => {
                            html = renderedHtml;
                            return undefined;
                        })
                        .then(() => dispatchAll(store, postrenderActionsToDispatch))
                        .then(() => html);
                });
        });
});

export default getHtml;
