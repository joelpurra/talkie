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

import {
	combineReducers,
} from "../store/combine-reducers.mjs";

import clipboard,
* as clipboardActions from "./clipboard.mjs";
import errors,
* as errorsActions from "./errors.mjs";
import history,
* as historyActions from "./history.mjs";
import languages,
* as languagesActions from "./languages.mjs";
import metadata,
* as metadataActions from "./metadata.mjs";
import navigation,
* as navigationActions from "./navigation.mjs";
import progress,
* as progressActions from "./progress.mjs";
import speaking,
* as speakingActions from "./speaking.mjs";
import voices,
* as voicesActions from "./voices.mjs";

export const actions = {
	clipboard: clipboardActions,
	errors: errorsActions,
	history: historyActions,
	languages: languagesActions,
	metadata: metadataActions,
	navigation: navigationActions,
	progress: progressActions,
	speaking: speakingActions,
	voices: voicesActions,
};

const reducers = combineReducers({
	clipboard,
	errors,
	history,
	languages,
	metadata,
	navigation,
	progress,
	speaking,
	voices,
});

export default reducers;
