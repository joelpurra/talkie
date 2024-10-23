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
	JsonObject,
} from "type-fest";

export type StorageKey = string;
export type StorageFormatVersion =
| "v1.0.0"
| "v1.1.0"
| "v1.2.0"
| "v1.3.0"
| "v1.4.0"
| "v1.5.0"
| "v1.6.0"
| "v1.7.0";

export interface IStorageMetadata extends JsonObject {
	"upgraded-at": number;
	"upgraded-from-version": StorageFormatVersion | null;
	version: StorageFormatVersion;
}

export const currentStorageFormatVersion: StorageFormatVersion = "v1.7.0";
export const storageMetadataId = "_storage-metadata";

export type IStorageUpgrader = (key: StorageKey) => Promise<boolean>;
export type IStorageUpgraderType = "identity";

export const allKnownStorageKeys: Record<StorageFormatVersion, Record<string, string>> = {
	"v1.0.0": {
		"options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
	},
	"v1.1.0": {
		"language-voice-overrides": "language-voice-overrides",
		"options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
		"voice-pitch-overrides": "voice-pitch-overrides",
		"voice-rate-overrides": "voice-rate-overrides",
	},
	"v1.2.0": {
		"language-voice-overrides": "language-voice-overrides",
		"voice-pitch-overrides": "voice-pitch-overrides",
		"voice-rate-overrides": "voice-rate-overrides",
	},
	"v1.3.0": {
		"language-voice-overrides": "language-voice-overrides",
		"speak-long-texts": "speak-long-texts",
		"voice-pitch-overrides": "voice-pitch-overrides",
		"voice-rate-overrides": "voice-rate-overrides",
	},
	"v1.4.0": {
		"is-premium-edition": "is-premium-edition",
		"language-voice-overrides": "language-voice-overrides",
		"speak-long-texts": "speak-long-texts",
		"voice-pitch-overrides": "voice-pitch-overrides",
		"voice-rate-overrides": "voice-rate-overrides",
	},
	"v1.5.0": {
		"is-premium-edition": "is-premium-edition",
		"language-voice-overrides": "language-voice-overrides",
		"show-additional-details": "show-additional-details",
		"speak-long-texts": "speak-long-texts",
		"voice-pitch-overrides": "voice-pitch-overrides",
		"voice-rate-overrides": "voice-rate-overrides",
	},
	"v1.6.0": {
		"is-premium-edition": "is-premium-edition",
		"language-voice-overrides": "language-voice-overrides",
		"show-additional-details": "show-additional-details",
		"speak-long-texts": "speak-long-texts",
		"speaking-history": "speaking-history",
		"speaking-history-limit": "speaking-history-limit",
		"voice-pitch-overrides": "voice-pitch-overrides",
		"voice-rate-overrides": "voice-rate-overrides",
	},
	"v1.7.0": {
		"is-premium-edition": "is-premium-edition",
		"language-voice-overrides": "language-voice-overrides",
		"show-additional-details": "show-additional-details",
		"speak-long-texts": "speak-long-texts",
		"speaking-history": "speaking-history",
		"speaking-history-limit": "speaking-history-limit",
		"stop-on-tab-removed": "stop-on-tab-removed",
		"stop-on-tab-updated-url": "stop-on-tab-updated-url",
		"voice-pitch-overrides": "voice-pitch-overrides",
		"voice-rate-overrides": "voice-rate-overrides",
	},
};

export const allKnownStorageFormatVersions: StorageFormatVersion[] = Object.keys(allKnownStorageKeys).sort() as StorageFormatVersion[];

{
	// NOTE: inline sanity-check/assertion of hardcoded values.
	// TODO: sort by semantic version.
	const versionPartOutOfSortableRange = allKnownStorageFormatVersions.some(
		(knownStorageFormatVersion) => knownStorageFormatVersion
			.split(".")
			.every((versionPart) => Number.parseInt(versionPart.replace(/^v/, ""), 10) >= 10),
	);

	if (versionPartOutOfSortableRange) {
		throw new RangeError(`A storage version part was out of sortable range. Fix by implementing semantic version sorting. ${JSON.stringify(allKnownStorageFormatVersions)}`);
	}
}

type IUpgradeTree = Partial<Record<StorageFormatVersion, Partial<Record<StorageFormatVersion, {
	upgradeType: IStorageUpgraderType;
}>>>>;

export const allKnownUpgradePaths: IUpgradeTree = {
	"v1.0.0": {
		"v1.1.0": {
			upgradeType: "identity",
		},
	},
	"v1.1.0": {
		"v1.2.0": {
			upgradeType: "identity",
		},
	},
	"v1.2.0": {
		"v1.3.0": {
			upgradeType: "identity",
		},
	},
	"v1.3.0": {
		"v1.4.0": {
			upgradeType: "identity",
		},
	},
	"v1.4.0": {
		"v1.5.0": {
			upgradeType: "identity",
		},
	},
	"v1.5.0": {
		"v1.6.0": {
			upgradeType: "identity",
		},
	},
	"v1.6.0": {
		"v1.7.0": {
			upgradeType: "identity",
		},
	},
};

export const getStorageKey = async (storageFormatVersion: StorageFormatVersion, key: StorageKey): Promise<string> => {
	if (!allKnownStorageKeys[storageFormatVersion]) {
		throw new Error(`Unknown storage format version: (${storageFormatVersion})`);
	}

	if (key !== storageMetadataId && !allKnownStorageKeys[storageFormatVersion][key]) {
		throw new Error(`Unknown storage key (${storageFormatVersion}): ${key}`);
	}

	// TODO: use full objects/object paths with MV3 chrome.storage.local.
	return `${storageFormatVersion}_${key}`;
};
