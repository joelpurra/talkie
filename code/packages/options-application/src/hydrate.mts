/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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
} from "@reduxjs/toolkit";
import hydrateHtml from "@talkie/browser-shared/hydrate/hydrate-html.mjs";
import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import App from "./containers/app.js";
import rootReducer, {
	actions,
} from "./slices/index.mjs";

// NOTE: empty to not modify the server state before hydrating the prerendered state on the client.
const prerenderActionsToDispatch: Action[] = [];
const postrenderActionsToDispatch: Action[] = [
	// NOTE: don't want to keep track of when to load these, preemptively loading.
	actions.settings.loadShowAdditionalDetails() as unknown as Action,
	actions.shared.languages.loadNavigatorLanguage() as unknown as Action,
	actions.shared.languages.loadNavigatorLanguages() as unknown as Action,
	actions.shared.voices.loadVoices() as unknown as Action,
	actions.tabs.loadActiveNavigationTabIdFromLocationHash() as unknown as Action,
];

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default async function hydrate(messageBusProviderGetter: IMessageBusProviderGetter): Promise<void> {
	await hydrateHtml(messageBusProviderGetter, rootReducer, prerenderActionsToDispatch, postrenderActionsToDispatch, App);
}
