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

import type {
	Action,
	Reducer,
} from "@reduxjs/toolkit";
import {
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import getRoot from "@talkie/shared-ui/renderers/get-root.js";
import {
	actions,
} from "@talkie/shared-ui/slices/index.mjs";
import getStore from "@talkie/shared-ui/store/get-store.mjs";
import {
	dispatchAll,
} from "@talkie/shared-ui/utils/store-helpers.mjs";

import compileHtmlTemplate from "./compile-html-template.mjs";
import getDependencies from "./get-dependencies.mjs";
import renderReactHtml from "./render-react-html.mjs";

const getPrerenderActionsToDispatch = <A extends Action>(prerenderedActionsToDispatch: Readonly<A[]>): Readonly<A[]> => {
	const serverSideDefaults: Readonly<A[]> = [
		// NOTE: currently attempts to match "synchronous usage" when hydrating the state in the browser.
		// NOTE: don't want to keep track of when to load these, preemptively loading.
		actions.metadata.loadIsPremiumEdition() as unknown as A,
		actions.metadata.loadSystemType() as unknown as A,
		actions.metadata.loadVersionName() as unknown as A,
		actions.metadata.loadVersionNumber() as unknown as A,
		actions.languages.loadTranslatedLanguages() as unknown as A,
	];

	const allActionsToDispatch: Array<Readonly<A>> = [
		...serverSideDefaults,
		...prerenderedActionsToDispatch,
	];

	return allActionsToDispatch;
};

const getPostrenderActionsToDispatch = <A extends Action>(postrenderActionsToDispatch: Readonly<A[]>): Readonly<A[]> => {
	const serverSideDefaults: Readonly<A[]> = [];

	const allActionsToDispatch: Array<Readonly<A>> = [
		...serverSideDefaults,
		...postrenderActionsToDispatch,
	];

	return allActionsToDispatch;
};

const EMPTY_INITIAL_STATE = undefined;

const render = async <S, A extends Action, P>(rootReducer: Reducer<S, A>,
	customPrerenderedActionsToDispatch: Readonly<A[]>,
	customPostrenderActionsToDispatch: Readonly<A[]>,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	reactHtmlTemplatePath: Readonly<URL>,
	// eslint-disable-next-line max-params, @typescript-eslint/prefer-readonly-parameter-types
	talkieLocale: TalkieLocale, ChildComponent: React.ComponentType<P>): Promise<string> => {
	const {
		api,
		broadcasterProvider,
		configuration,
		localeProvider,
		styletronProvider,
		translatorProvider,
	} = await getDependencies();

	localeProvider.setTranslationLocale(talkieLocale);

	const store = getStore(EMPTY_INITIAL_STATE, rootReducer, api);
	const prerenderedActionsToDispatch = getPrerenderActionsToDispatch<A>(customPrerenderedActionsToDispatch);
	const postrenderActionsToDispatch = getPostrenderActionsToDispatch<A>(customPostrenderActionsToDispatch);

	await dispatchAll(store, prerenderedActionsToDispatch);

	const reactHtmlTemplate = await compileHtmlTemplate(reactHtmlTemplatePath);
	const root = await getRoot(store, translatorProvider, configuration, styletronProvider, broadcasterProvider, ChildComponent);
	const html = await renderReactHtml<S, A>(store, reactHtmlTemplate, localeProvider, styletronProvider, root);

	// NOTE: the side effects of post-render actions will not affect the rendered html.
	await dispatchAll(store, postrenderActionsToDispatch);

	return html;
};

export default render;
