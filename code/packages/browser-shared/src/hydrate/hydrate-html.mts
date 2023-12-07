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
import getRoot from "@talkie/shared-ui/renderers/get-root.js";
import getStore from "@talkie/shared-ui/store/get-store.mjs";
import {
	dispatchAll,
} from "@talkie/shared-ui/utils/store-helpers.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type React from "react";
import ReactDOM from "react-dom";

import {
	getPostrenderActionsToDispatch,
	getPrerenderActionsToDispatch,
} from "./get-actions.mjs";
import getDependencies from "./get-dependencies.mjs";
import getPrerenderedState from "./get-prerendered-state.mjs";

const hydrateReactDom = async (root: Readonly<JSX.Element>) => {
	const rootElement = document.querySelector("#react-root");

	ReactDOM.hydrate(root, rootElement);
};

const hydrateHtml = async <S, A extends Action, P>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	messageBusProviderGetter: IMessageBusProviderGetter,
	rootReducer: Reducer<S, A>,
	customPrerenderedActionsToDispatch: Readonly<A[]>,
	customPostrenderActionsToDispatch: Readonly<A[]>,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	ChildComponent: React.ComponentType<P>,
// eslint-disable-next-line max-params
): Promise<void> => {
	const {
		api,
		configuration,
		styletronProvider,
		translatorProvider,
	} = getDependencies(messageBusProviderGetter);
	const prerenderedState = getPrerenderedState<S>();
	const store = getStore(prerenderedState, rootReducer, api);
	const prerenderedActionsToDispatch = getPrerenderActionsToDispatch(customPrerenderedActionsToDispatch);
	const postrenderActionsToDispatch = getPostrenderActionsToDispatch(customPostrenderActionsToDispatch);

	await dispatchAll(store, prerenderedActionsToDispatch);

	const root = await getRoot(store, translatorProvider, configuration, styletronProvider, messageBusProviderGetter, ChildComponent);
	await hydrateReactDom(root);

	// NOTE: don't await post-render actions, since they will be rendered when they're ready anyways.
	void dispatchAll(store, postrenderActionsToDispatch);
};

export default hydrateHtml;
