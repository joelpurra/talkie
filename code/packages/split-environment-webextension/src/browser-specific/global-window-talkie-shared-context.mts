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
	MessageBusContextIdentifier,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";

import {
	type ITalkieSharedContext,
} from "./italkie-shared-context.mjs";

declare global {
	// TODO: be more selective about where this "global" augmentation is applied?
	// NOTE: typing for both the globalThis context (used in/from the background) and Window interface (used when retrieving the background context).
	// eslint-disable-next-line no-var
	var talkieContextIdentifier: MessageBusContextIdentifier;
	// eslint-disable-next-line no-var
	var talkieSharedContext: ITalkieSharedContext;

	interface Window {
		talkieContextIdentifier?: MessageBusContextIdentifier;
		talkieSharedContext: ITalkieSharedContext;
	}
}
