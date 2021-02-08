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
	logError,
	logTrace,
	logWarn,
} from "./log";
import {
	isDeadWrapper,
} from "./tabs";

export default class Broadcaster {
	constructor() {
		this.actionListeningMap = {};
	}

	async unregisterListeningAction(actionName, listeningActionHandler) {
		if (!this.actionListeningMap[actionName]) {
			throw new Error(`No listening action(s) registered for action: ${typeof actionName} ${JSON.stringify(actionName)}`);
		}

		const countBefore = this.actionListeningMap[actionName].length;

		this.actionListeningMap[actionName] = this.actionListeningMap[actionName].filter((registeredListeningActionHandler) => registeredListeningActionHandler !== listeningActionHandler);

		const countAfter = this.actionListeningMap[actionName].length;

		if (countBefore === countAfter) {
			throw new Error(`The specific listening action handler was not registered for action: ${typeof actionName} ${JSON.stringify(actionName)}`);
		}
	}

	async registerListeningAction(actionName, listeningActionHandler) {
		this.actionListeningMap[actionName] = (this.actionListeningMap[actionName] || []).concat(listeningActionHandler);

		const killSwitch = () => {
			// NOTE: the promise chain probably won't be completed (by the caller, outside of this function), as the kill switch might be executed during the "onunload" event.
			return this.unregisterListeningAction(actionName, listeningActionHandler);
		};

		return killSwitch;
	}

	async broadcastEvent(actionName, actionData) {
		logTrace("Start", "Sending message", actionName, actionData);

		const listeningActions = this.actionListeningMap[actionName];

		if (!listeningActions || listeningActions.length === 0) {
			logTrace("Skipping", "Sending message", actionName, actionData);

			return [];
		}

		// TODO: switch to bluebird for async/promise mapping, also for the browser?
		const listeningActionPromises = listeningActions.map(
			(action) => (async () => {
				try {
				// NOTE: check for dead objects from cross-page (background, popup, options, ...) memory leaks.
				// NOTE: this is just in case the killSwitch hasn't been called.
				// https://developer.mozilla.org/en-US/docs/Extensions/Common_causes_of_memory_leaks_in_extensions#Failing_to_clean_up_event_listeners
				// TODO: throw error instead of cleaning up?
				// TODO: clean up code to avoid memory leaks, primarily in Firefox as it doesn't have onSuspend at the moment.
					if (isDeadWrapper(action)) {
						logWarn("Dead wrapper (detected)", "Sending message", actionName, actionData);

						return this.unregisterListeningAction(actionName, action);
					}

					return action(actionName, actionData);
				} catch (error) {
					if (error && typeof error === "object" && typeof error.message === "string" && error.message.includes("access dead object")) {
					// NOTE: it's a dead wrapper, but it wasn't detected by isDeadWrapper() above. Ignore.
						logWarn("Dead wrapper (caught)", "Sending message", actionName, actionData);

						return this.unregisterListeningAction(actionName, action);
					}

					throw error;
				}
			})(),
		);

		try {
			const responses = await Promise.all(listeningActionPromises);

			logTrace("Done", "Sending message", actionName, actionData, responses);

			return responses;
		} catch (error) {
			logError("Sending message", actionName, actionData);

			throw error;
		}
	}
}
