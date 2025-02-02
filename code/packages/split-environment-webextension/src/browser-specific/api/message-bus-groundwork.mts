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

import type IApiGroundwork from "@talkie/split-environment-interfaces/iapi/iapi-groundwork.mjs";
import type IApiGroundworkClipboard from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-clipboard.mjs";
import type IApiGroundworkConfiguration from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-configuration.mjs";
import type IApiGroundworkHistory from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-history.mjs";
import type IApiGroundworkSpeaking from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-speaking.mjs";
import type IApiGroundworkUi from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-ui.mjs";
import type IApiGroundworkVoices from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-voices.mjs";

export default class MesssageBusGroundwork implements IApiGroundwork {
	// eslint-disable-next-line max-params
	constructor(
		readonly clipboard: IApiGroundworkClipboard,
		readonly configuration: IApiGroundworkConfiguration,
		readonly history: IApiGroundworkHistory,
		readonly speaking: IApiGroundworkSpeaking,
		readonly ui: IApiGroundworkUi,
		readonly voices: IApiGroundworkVoices,
	) {}
}
