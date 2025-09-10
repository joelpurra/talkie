/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>
Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>
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

import type IApiGroundworkClipboard from "./iapi-groundwork-clipboard.mjs";
import type IApiGroundworkConfiguration from "./iapi-groundwork-configuration.mjs";
import type IApiGroundworkHistory from "./iapi-groundwork-history.mjs";
import type IApiGroundworkSpeaking from "./iapi-groundwork-speaking.mjs";
import type IApiGroundworkUi from "./iapi-groundwork-ui.mjs";
import type IApiGroundworkVoices from "./iapi-groundwork-voices.mjs";

export default interface IApiGroundwork {
	clipboard: IApiGroundworkClipboard;
	configuration: IApiGroundworkConfiguration;
	history: IApiGroundworkHistory;
	speaking: IApiGroundworkSpeaking;
	ui: IApiGroundworkUi;
	voices: IApiGroundworkVoices;
}
