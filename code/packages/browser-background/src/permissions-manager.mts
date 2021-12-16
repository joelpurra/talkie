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

import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	Mutable,
	Promisable,
	ReadonlyDeep,
} from "type-fest";
import type {
	Manifest,
	Permissions,
} from "webextension-polyfill";

export type UsePermissionsCallback<T> = (isGranted: boolean) => Promisable<T>;

export default class PermissionsManager {
	private readonly _pms: Permissions.Static;

	constructor() {
		// NOTE: this is obfuscation to avoid errors regarding the permissions API not yet being implemented in Firefox (WebExtensions).
		// NOTE: am doing feature detection, and this code should not even be called as the menus are not enabled for WebExtensions (Firefox).
		// TODO: remove once Firefox is the main/only browser, and/or update strict_min_version in manifest.json.
		const something = browser;
		this._pms = something.permissions;
	}

	async browserHasPermissionsFeature(): Promise<boolean> {
		return Boolean(this._pms);
	}

	async hasPermissions(permissionNames: ReadonlyDeep<Manifest.Permission[]>, origins: ReadonlyDeep<Manifest.MatchPattern[]>): Promise<boolean> {
		return this._pms.contains({
			origins,
			permissions: permissionNames,
		} as Mutable<{
			origins: Manifest.MatchPattern[];
			permissions: Manifest.Permission[];
		}>);
	}

	async acquirePermissions(permissionNames: ReadonlyDeep<Manifest.OptionalPermission[]>, origins: ReadonlyDeep<Manifest.MatchPattern[]>): Promise<boolean> {
		return this._pms.request({
			origins,
			permissions: permissionNames,
		} as Mutable<{
			origins: Manifest.MatchPattern[];
			permissions: Manifest.OptionalPermission[];
		}>);
	}

	async releasePermissions(permissionNames: ReadonlyDeep<Manifest.OptionalPermission[]>, origins: ReadonlyDeep<Manifest.MatchPattern[]>): Promise<boolean> {
		return this._pms.remove({
			origins,
			permissions: permissionNames,
		} as Mutable<{
			origins: Manifest.MatchPattern[];
			permissions: Manifest.OptionalPermission[];
		}>);
	}

	async useOptionalPermissions<T>(permissionNames: ReadonlyDeep<Manifest.OptionalPermission[]>, origins: ReadonlyDeep<Manifest.MatchPattern[]>, fn: UsePermissionsCallback<T>): Promise<T> {
		void logDebug("Start", "useOptionalPermissions", permissionNames.length, permissionNames, origins.length, origins);

		const activePermissionNames: Manifest.OptionalPermission[] = [];
		const inactivePermissionNames: Manifest.OptionalPermission[] = [];

		for await (const permissionName of permissionNames) {
			// TODO: be more fine-grained per origin as well?
			const hasPermission = await this.hasPermissions(
				[
					permissionName,
				],
				origins,
			);

			if (hasPermission) {
				activePermissionNames.push(permissionName);
			} else {
				inactivePermissionNames.push(permissionName);
			}
		}

		void logDebug("useOptionalPermissions", permissionNames.length, origins.length, "Already acquired", activePermissionNames);
		void logDebug("useOptionalPermissions", permissionNames.length, origins.length, "Not yet acquired", inactivePermissionNames);

		const granted = await this.acquirePermissions(inactivePermissionNames, origins);

		if (granted) {
			void logDebug("useOptionalPermissions", permissionNames.length, origins.length, "All permissions acquired");
		} else {
			void logDebug("useOptionalPermissions", permissionNames.length, origins.length, "Permissions not acquired");
		}

		try {
			// NOTE: using callback style to simplify permissions usage and minimize the period during which permissions are acquired.
			const result = await fn(granted);

			await this.releasePermissions(inactivePermissionNames, origins);

			void logDebug("Done", "useOptionalPermissions", permissionNames.length, origins.length);

			return result;
		} catch (error: unknown) {
			void logError("useOptionalPermissions", permissionNames.length, origins.length, error);

			await this.releasePermissions(inactivePermissionNames, origins);

			throw error;
		}
	}
}
