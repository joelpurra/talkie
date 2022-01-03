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
	type KillSwitch,
} from "@talkie/shared-interfaces/killswitch.mjs";
import {
	knownEvents,
} from "@talkie/shared-interfaces/known-events.mjs";
import React from "react";

import {
	BroadcasterContext,
} from "../../containers/providers.js";
import {
	type actions,
} from "../../slices/index.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IsSpeakingListenerStateProps {}

export interface IsSpeakingListenerDispatchProps {
	setIsSpeaking: typeof actions.speaking.setIsSpeaking;
}

export default class IsSpeakingListener<P extends IsSpeakingListenerStateProps & IsSpeakingListenerDispatchProps> extends React.PureComponent<P> {
	static override contextType = BroadcasterContext;

	// eslint-disable-next-line react/static-property-placement
	declare context: React.ContextType<typeof BroadcasterContext>;

	isListeningToBroadcasts: boolean;
	killSwitches: KillSwitch[];

	constructor(props: P) {
		super(props);

		this.componentCleanup = this.componentCleanup.bind(this);
		this.isListeningToBroadcasts = false;
		this.killSwitches = [];
	}

	override componentDidMount(): void {
		window.addEventListener("beforeunload", this.componentCleanup);

		void this.registerBroadcastListeners();
		this.isListeningToBroadcasts = true;
	}

	override componentWillUnmount(): void {
		window.removeEventListener("beforeunload", this.componentCleanup);

		this.componentCleanup();
	}

	componentCleanup(): void {
		this.isListeningToBroadcasts = false;
		this.executeKillSwitches();
	}

	override render(): React.ReactNode {
		return null;
	}

	updateIsSpeaking(isSpeaking: boolean): void {
		if (!this.isListeningToBroadcasts) {
			return;
		}

		this.props.setIsSpeaking(isSpeaking);
	}

	executeKillSwitches(): void {
		// NOTE: expected to have only synchronous methods for the relevant parts.
		const killSwitchesToExecute = this.killSwitches;
		this.killSwitches = [];

		for (const killSwitch of killSwitchesToExecute) {
			try {
				killSwitch();
			} catch {
				try {
					// dualLogger.dualLogError("executeKillSwitches", error);
				} catch {
					// NOTE: ignoring error logging errors.
				}
			}
		}
	}

	async registerBroadcastListeners(): Promise<void> {
		const killSwitches = await Promise.all([
			this.context.broadcaster.registerListeningAction(
				knownEvents.beforeSpeaking,
				(_actionName: string, _actionData: unknown) => {
					this.updateIsSpeaking(true);
				}),
			this.context.broadcaster.registerListeningAction(
				knownEvents.beforeSpeakingPart,
				(_actionName: string, _actionData: unknown) => {
					this.updateIsSpeaking(true);
				}),
			this.context.broadcaster.registerListeningAction(
				knownEvents.afterSpeaking,
				(_actionName: string, _actionData: unknown) => {
					this.updateIsSpeaking(false);
				}),
		]);

		for (const killSwitch of killSwitches) {
			this.killSwitches.push(killSwitch);
		}
	}
}
