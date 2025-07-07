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

import type IPermissionManager from "@talkie/shared-interfaces/ipermission-manager.mjs";
import type {
	UsePermissionsCallback,
} from "@talkie/shared-interfaces/ipermission-manager.mjs";
import type {
	Manifest,
} from "webextension-polyfill";

import type PermissionsProvider from "./permissions-provider.mjs";

import {
	logError,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";

export default abstract class PermissionManager implements IPermissionManager {
	constructor(
		private readonly permissionsManager: PermissionsProvider,
		protected readonly permissions: Manifest.OptionalPermission[],
		protected readonly context: Manifest.MatchPattern[],
	) {}

	async askPermission(): Promise<boolean | null> {
		if (!await this.permissionsManager.permissionsAvailableInContext()) {
			void logWarn(this.constructor.name, "Could not access the browser permissions system to check/request clipboard permissions.");

			return null;
		}

		try {
			const hasPermission = await this.permissionsManager.acquirePermissions(
				this.permissions,
				this.context,
			);

			return hasPermission;
		} catch (error: unknown) {
			void logError(this.constructor.name, "swallowing error", error);
		}

		return null;
	}

	async hasPermission(): Promise<boolean | null> {
		if (!await this.permissionsManager.permissionsAvailableInContext()) {
			void logWarn(this.constructor.name, "Could not access the browser permissions system to check/request clipboard permissions.");

			return null;
		}

		try {
			const hasPermission = await this.permissionsManager.hasPermissions(
				this.permissions,
				this.context,
			);

			return hasPermission;
		} catch (error: unknown) {
			void logError(this.constructor.name, "swallowing error", error);
		}

		return null;
	}

	async denyPermission(): Promise<boolean | null> {
		if (!await this.permissionsManager.permissionsAvailableInContext()) {
			void logWarn(this.constructor.name, "Could not access the browser permissions system to check/request clipboard permissions.");

			return null;
		}

		try {
			const permissionRemoved = await this.permissionsManager.denyPermissions(
				this.permissions,
				this.context,
			);

			return permissionRemoved;
		} catch (error: unknown) {
			void logError(this.constructor.name, "swallowing error", error);
		}

		return null;
	}

	/**
	 * @deprecated Prefer asking once (or rarely) for permissions, then keeping them.
	 */
	async askUseDenyPermissions<T>(fn: UsePermissionsCallback<T>): Promise<T | null> {
		if (!await this.permissionsManager.permissionsAvailableInContext()) {
			void logWarn(this.constructor.name, "Could not access the browser permissions system to check/request clipboard permissions.");

			return null;
		}

		try {
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			const result = await this.permissionsManager.askUseDenyPermissions<T>(
				this.permissions,
				this.context,
				fn,
			);

			return result;
		} catch (error: unknown) {
			void logError(this.constructor.name, "swallowing error", error);
		}

		return null;
	}
}
