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

import type {
	Action,
} from "@reduxjs/toolkit";

import {
	actions,
} from "@talkie/shared-ui/slices/index.mjs";

export const getPrerenderActionsToDispatch = <A extends Action>(prerenderedActionsToDispatch: readonly A[]): readonly A[] => {
	const browserDefaults: readonly A[] = [];

	const allActionsToDispatch: A[] = [
		...browserDefaults,
		...prerenderedActionsToDispatch,
	];

	return allActionsToDispatch;
};

export const getPostrenderActionsToDispatch = <A extends Action>(postrenderActionsToDispatch: readonly A[]): readonly A[] => {
	const browserDefaults: A[] = [
		// NOTE: don't want to keep track of when to load these, preemptively loading.
		actions.metadata.loadIsPremiumEdition() as unknown as A,
		actions.metadata.loadOsType() as unknown as A,
	];

	const allActionsToDispatch: A[] = [
		...browserDefaults,
		...postrenderActionsToDispatch,
	];

	return allActionsToDispatch;
};
