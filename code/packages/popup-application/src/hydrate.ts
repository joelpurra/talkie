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

import hydrateHtml from "@talkie/browser-shared/hydrate/hydrate-html";
import {
	Action,
} from "redux";

import App from "./containers/app";
import rootReducer from "./slices/index";

// NOTE: empty to not modify the server state before hydrating the prerendered state on the client.
const prerenderActionsToDispatch: Action[] = [];
const postrenderActionsToDispatch: Action[] = [];

export default async function hydrate(): Promise<void> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await hydrateHtml(rootReducer, prerenderActionsToDispatch as any, postrenderActionsToDispatch as any, App);
}
