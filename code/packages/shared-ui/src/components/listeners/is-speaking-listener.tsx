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
	type SpeakingEventData,
	type SpeakingEventPartData,
} from "@talkie/shared-interfaces/ispeaking-event.mjs";
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
	loadSpeakingHistory: typeof actions.speaking.loadSpeakingHistory;
	setIsSpeaking: typeof actions.speaking.setIsSpeaking;
	setMostRecentLanguage: typeof actions.speaking.setMostRecentLanguage;
	setMostRecentPitch: typeof actions.speaking.setMostRecentPitch;
	setMostRecentRate: typeof actions.speaking.setMostRecentRate;
	setMostRecentText: typeof actions.speaking.setMostRecentText;
	setMostRecentVoiceName: typeof actions.speaking.setMostRecentVoiceName;
}

export default class IsSpeakingListener<P extends IsSpeakingListenerStateProps & IsSpeakingListenerDispatchProps> extends React.PureComponent<P> {
	static override contextType = BroadcasterContext;

	// eslint-disable-next-line react/static-property-placement
	declare context: React.ContextType<typeof BroadcasterContext>;

	killSwitches: KillSwitch[];

	constructor(props: P) {
		super(props);

		this.componentCleanup = this.componentCleanup.bind(this);
		this.updateIsSpeaking = this.updateIsSpeaking.bind(this);
		this.killSwitches = [];
	}

	override componentDidMount(): void {
		window.addEventListener("beforeunload", this.componentCleanup);

		void this.registerBroadcastListeners();
	}

	override componentWillUnmount(): void {
		this.componentCleanup();
	}

	componentCleanup(): void {
		window.removeEventListener("beforeunload", this.componentCleanup);

		this.executeKillSwitches();
	}

	override render(): React.ReactNode {
		return null;
	}

	updateIsSpeaking(isSpeaking: boolean): void {
		// TODO: move other listener feature types out of the class.
		this.props.setIsSpeaking(isSpeaking);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	updateSpeakingEventPartData(actionData: Readonly<SpeakingEventPartData>): void {
		this.updateIsSpeaking(true);

		// TODO: separate most recent spoken from other listeners.
		// this.props.setMostRecentTextPart(actionData.textPart);
		// this.props.setMostRecentTextPartOffset(actionData.textPartOffset);
		// this.props.setMostRecentVoiceName(actionData.actualVoice);
		this.props.setMostRecentPitch(actionData.pitch);
		this.props.setMostRecentRate(actionData.rate);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	updateSpeakingEventData(actionData: Readonly<SpeakingEventData>): void {
		this.updateIsSpeaking(true);

		// TODO: separate most recent spoken from other listeners.
		this.props.setMostRecentLanguage(actionData.language);
		this.props.setMostRecentText(actionData.text);
		this.props.setMostRecentVoiceName(actionData.voiceName);

		// TODO: separate speaking history from other listeners.
		// NOTE: storing the speaking history entry is also event-driven, so listener order matters.
		// HACK: wait until the speaking history entry has (hopefully) been stored.
		// TODO: add pre/post events?
		setTimeout(() => this.props.loadSpeakingHistory(), 100);
	}

	executeKillSwitches(): void {
		// TODO: base component class for other components with broadcast listeners and kill switches.
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
				(
					_actionName,
					// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
					actionData: Readonly<SpeakingEventData>,
				) => {
					this.updateSpeakingEventData(actionData);
				}),

			this.context.broadcaster.registerListeningAction(
				knownEvents.beforeSpeakingPart,
				(
					_actionName,
					// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
					actionData: Readonly<SpeakingEventPartData>,
				) => {
					this.updateSpeakingEventPartData(actionData);
				}),

			this.context.broadcaster.registerListeningAction(
				knownEvents.afterSpeaking,
				(_actionName, _actionData: unknown) => {
					this.updateIsSpeaking(false);
				}),
		]);

		for (const killSwitch of killSwitches) {
			this.killSwitches.push(killSwitch);
		}
	}
}
