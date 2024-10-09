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
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import type {
	ValueOf,
} from "type-fest";

// TODO: merge parallel objects.
export enum KnownSettingStorageKeys {
	IsPremiumEdition = "is-premium-edition",
	ShowAdditionalDetails = "show-additional-details",
	SpeakingHistory = "speaking-history",
	SpeakingHistoryLimit = "speaking-history-limit",
	SpeakLongTexts = "speak-long-texts",
	ContinueOnTabRemoved = "stop-on-tab-removed",
	ContinueOnTabUpdatedUrl = "stop-on-tab-updated-url",
}
export type KnownSettingNames = keyof typeof KnownSettingStorageKeys;
export type KnownSettingValues = ValueOf<KnownSettingStorageKeys>;

export const KnownSettingDefaults = {
	ContinueOnTabRemoved: false,
	ContinueOnTabUpdatedUrl: false,
	IsPremiumEdition: false,
	ShowAdditionalDetails: false,
	SpeakLongTexts: false,
	SpeakingHistory: [] as Readonly<SpeakingHistoryEntry[]>,
	SpeakingHistoryLimit: 0,
};
export type KnownSettingDefaultNames = keyof typeof KnownSettingDefaults;
export type KnownSettingDefaultValues = ValueOf<typeof KnownSettingDefaults>;

export interface SettingRange {
	max: number;
	min: number;
}
export const KnownSettingRanges = {
	SpeakingHistoryLimit: {
		max: 100,
		min: 0,
		step: 10,
	},
};
export type KnownSettingRangeNames = keyof typeof KnownSettingRanges;
export type KnownSettingRangeValues = ValueOf<typeof KnownSettingRanges>;
