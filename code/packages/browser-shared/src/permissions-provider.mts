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
import {
	type UsePermissionsCallback,
} from "@talkie/shared-interfaces/ipermission-manager.mjs";
import type {
	ReadonlyDeep,
	Writable,
} from "type-fest";
import type {
	Manifest,
} from "webextension-polyfill";

export default class PermissionsProvider {
	// TODO: install permission listeners.
	// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/onAdded
	// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/onRemoved
	async permissionsAvailableInContext(): Promise<boolean> {
		// NOTE: permissions are not accessible in all contexts.
		return Boolean(chrome.permissions);
	}

	async hasPermissions(permissionNames: ReadonlyDeep<Manifest.Permission[]>, origins: ReadonlyDeep<Manifest.MatchPattern[]>): Promise<boolean> {
		// NOTE: firefox may not allow checking permissions before requesting them, since the user interaction requirement is lost when performing async work.
		// > Error: permissions.request may only be called from a user input handler
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1398833
		return chrome.permissions.contains({
			origins,
			permissions: permissionNames,
		} as Writable<{
			origins: Manifest.MatchPattern[];
			permissions: Manifest.Permission[];
		}>);
	}

	async acquirePermissions(permissionNames: ReadonlyDeep<Manifest.OptionalPermission[]>, origins: ReadonlyDeep<Manifest.MatchPattern[]>): Promise<boolean> {
		// NOTE: firefox may not allow a request this "deep", since the user input flag is lost during async function calls and message bus use.
		// > Error: permissions.request may only be called from a user input handler
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1392624
		return chrome.permissions.request({
			origins,
			permissions: permissionNames,
		} as Writable<{
			origins: Manifest.MatchPattern[];
			permissions: Manifest.OptionalPermission[];
		}>);
	}

	async denyPermissions(permissionNames: ReadonlyDeep<Manifest.OptionalPermission[]>, origins: ReadonlyDeep<Manifest.MatchPattern[]>): Promise<boolean> {
		// NOTE: firefox documentation is clear, but chrome's is not; what if the permissions were not previously granted?
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/remove
		// > A Promise that is fulfilled with true if the permissions listed in the permissions argument are now not granted to the extension, or false otherwise.
		// https://developer.chrome.com/docs/extensions/reference/api/permissions#method-remove
		// > True if the permissions were removed.
		return chrome.permissions.remove({
			origins,
			permissions: permissionNames,
		} as Writable<{
			origins: Manifest.MatchPattern[];
			permissions: Manifest.OptionalPermission[];
		}>);
	}

	/**
	 * @deprecated Prefer asking once (or rarely) for permissions, then keeping them.
	 */
	async askUseDenyPermissions<T>(permissionNames: ReadonlyDeep<Manifest.OptionalPermission[]>, origins: ReadonlyDeep<Manifest.MatchPattern[]>, fn: UsePermissionsCallback<T>): Promise<T> {
		void logDebug("Start", "askUseDenyPermissions", permissionNames.length, permissionNames, origins.length, origins);

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

		void logDebug("askUseDenyPermissions", permissionNames.length, origins.length, "Already acquired", activePermissionNames);
		void logDebug("askUseDenyPermissions", permissionNames.length, origins.length, "Not yet acquired", inactivePermissionNames);

		const granted = await this.acquirePermissions(inactivePermissionNames, origins);

		if (granted) {
			void logDebug("askUseDenyPermissions", permissionNames.length, origins.length, "All permissions acquired");
		} else {
			void logDebug("askUseDenyPermissions", permissionNames.length, origins.length, "Permissions not acquired");
		}

		try {
			// NOTE: using callback style to simplify permissions usage and minimize the period during which permissions are acquired.
			const result = await fn(granted);

			await this.denyPermissions(inactivePermissionNames, origins);

			void logDebug("Done", "askUseDenyPermissions", permissionNames.length, origins.length);

			return result;
		} catch (error: unknown) {
			void logError("askUseDenyPermissions", permissionNames.length, origins.length, error);

			await this.denyPermissions(inactivePermissionNames, origins);

			throw error;
		}
	}
}
