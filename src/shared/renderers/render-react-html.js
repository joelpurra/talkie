/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>

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

import ReactDOMServer from "react-dom/server";

import sharedActions from "../actions";
import {
	dispatchAll,
} from "../utils/store-helpers";
import autoRoot from "./auto-root";

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

// eslint-disable-next-line max-params
const renderHtml = async (store, reactHtmlTemplate, localeProvider, styletron, root) => {
	const reactRoot = ReactDOMServer.renderToString(root);
	const translationLocale = localeProvider.getTranslationLocale();
	const stylesForHead = styletron.getStylesheetsHtml();
	const prerenderedState = store.getState();

	// WARNING: See the following for security issues around embedding JSON in HTML:
	// https://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
	const prerenderedStateJson = JSON.stringify(prerenderedState).replace(/</g, "\\u003c");

	const html = reactHtmlTemplate({
		locale: translationLocale,
		prerenderedStateJson,
		reactRoot,
		stylesForHead,
	});

	return html;
};

// eslint-disable-next-line max-params
const getHtml = async (rootReducer, customPrerenderedActionsToDispatch, customPostrenderActionsToDispatch, reactHtmlTemplate, talkieLocale, ChildComponent) => {
	const prerenderedActionsToDispatch = getPrerenderActionsToDispatch(customPrerenderedActionsToDispatch);
	const postrenderActionsToDispatch = getPostrenderActionsToDispatch(customPostrenderActionsToDispatch);

	const {
		root,
		store,
		styletron,
		localeProvider,
	} = await autoRoot(EMPTY_STATE, rootReducer, ChildComponent);

	localeProvider.setTranslationLocale(talkieLocale);

	await dispatchAll(store, prerenderedActionsToDispatch);

	const html = await renderHtml(store, reactHtmlTemplate, localeProvider, styletron, root);

	await dispatchAll(store, postrenderActionsToDispatch);

	return html;
};

export default getHtml;
