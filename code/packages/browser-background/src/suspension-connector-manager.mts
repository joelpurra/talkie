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
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	Runtime,
} from "webextension-polyfill";

export default class SuspensionConnectorManager {
	private talkiePreventSuspensionPort: Runtime.Port | null = null;

	// NOTE: could be made configurable, in case there are multiple reasons to manage suspension.
	private get preventSuspensionPortName() {
		return "talkie-prevents-suspension";
	}

	async _connectToStayAlive(): Promise<void> {
		void logDebug("Start", "_connectToStayAlive");

		const extensionId = undefined;
		const preventSuspensionConnectOptions = {
			name: this.preventSuspensionPortName,
		};

		this.talkiePreventSuspensionPort = browser.runtime.connect(extensionId, preventSuspensionConnectOptions);

		if (this.talkiePreventSuspensionPort === null) {
			throw new Error(`Could not connect to ${this.preventSuspensionPortName}.`);
		}

		const onDisconnectHandler = () => {
			void logDebug("onDisconnect", "_connectToStayAlive");

			this.talkiePreventSuspensionPort = null;
		};

		this.talkiePreventSuspensionPort.onDisconnect.addListener(onDisconnectHandler);

		const _onMessageHandler = (message: unknown) => {
			void logDebug("_onMessageHandler", "_connectToStayAlive", message);
		};

		// NOTE: this message listener is unnecessary.
		this.talkiePreventSuspensionPort.onMessage.addListener(_onMessageHandler);

		// TODO: set message target.

		this.talkiePreventSuspensionPort.postMessage("Hello from the SuspensionConnectorManager.");

		void logDebug("Done", "_connectToStayAlive");
	}

	async _disconnectToDie(): Promise<void> {
		void logDebug("Start", "_disconnectToDie");

		if (this.talkiePreventSuspensionPort === null) {
			// TODO: investigate if this should happen during normal operation, or not.
			// throw new Error("this.talkiePreventSuspensionPort is null");
			void logDebug("Done", "_disconnectToDie", "already null");

			return;
		}

		// TODO: set message target.

		this.talkiePreventSuspensionPort.postMessage("Goodbye from the SuspensionConnectorManager.");

		// https://developer.chrome.com/extensions/runtime#type-Port
		// NOTE: should work irregardless if the port was connected or not.
		this.talkiePreventSuspensionPort.disconnect();

		this.talkiePreventSuspensionPort = null;

		void logDebug("Done", "_disconnectToDie");
	}
}
