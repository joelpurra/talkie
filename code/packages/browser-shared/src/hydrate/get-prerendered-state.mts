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
	PreloadedState,
} from "@reduxjs/toolkit";

// eslint-disable-next-line @typescript-eslint/comma-dangle
const getPrerenderedState = <S,>(): PreloadedState<S> => {
	// NOTE: use preloaded state from the pre-rendered html.
	const prerenderedStateSelector = "#__PRERENDERED_STATE__";
	const stateValueElement = document.querySelector(prerenderedStateSelector);

	if (!stateValueElement) {
		throw new Error(`Could not find state value element: ${prerenderedStateSelector} ${JSON.stringify(stateValueElement)}`);
	}

	const stateValue = stateValueElement.textContent;

	if (typeof stateValue !== "string") {
		throw new TypeError(`Could not load state from HTML: ${prerenderedStateSelector} ${JSON.stringify(stateValue)}`);
	}

	const prerenderedState: PreloadedState<S> = JSON.parse(stateValue) as PreloadedState<S>;

	return prerenderedState;
};

export default getPrerenderedState;

