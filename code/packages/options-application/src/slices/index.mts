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

import shared, {
	actions as sharedActions,
} from "@talkie/shared-ui/slices/index.mjs";
import {
	combineReducers,
} from "@talkie/shared-ui/store/combine-reducers.mjs";

import voices, * as voicesActions from "./voices.mjs";
import settings, * as settingsActions from "./settings.mjs";
import welcome, * as welcomeActions from "./welcome.mjs";
import tabs, * as tabsActions from "./tabs.mjs";

export const actions = {
	settings: settingsActions,
	shared: sharedActions,
	voices: voicesActions,
	welcome: welcomeActions,
	tabs: tabsActions,
};

const reducers = combineReducers({
	settings,
	shared,
	voices,
	welcome,
	tabs,
});

export default reducers;
