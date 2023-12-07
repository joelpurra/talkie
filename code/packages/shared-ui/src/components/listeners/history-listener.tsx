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
	startCrowdee,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	executeUninitializers,
} from "@talkie/shared-application-helpers/uninitializer-handler.mjs";
import type {
	SpeakingEventPartData,
} from "@talkie/shared-interfaces/ispeaking-event.mjs";
import type {
	SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import type {
	UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";
import React from "react";

import {
	MessageBusContext,
} from "../../containers/providers.js";
import type {
	actions,
} from "../../slices/index.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HistoryListenerStateProps {}

export interface HistoryListenerDispatchProps {
	setMostRecent: typeof actions.history.setMostRecent;
	setSpeakingHistory: typeof actions.history.setSpeakingHistory;
}

export default class HistoryListener<P extends HistoryListenerStateProps & HistoryListenerDispatchProps> extends React.PureComponent<P> {
	static override contextType = MessageBusContext;

	// eslint-disable-next-line react/static-property-placement
	declare context: React.ContextType<typeof MessageBusContext>;

	// TODO: weak callback references?
	private readonly _uninitializers: UninitializerCallback[] = [];

	constructor(props: P) {
		super(props);

		this.componentCleanup = this.componentCleanup.bind(this);
		this.setSpeakingHistory = this.setSpeakingHistory.bind(this);
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

		void executeUninitializers(this._uninitializers);
	}

	override render(): React.ReactNode {
		return null;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	setSpeakingHistory(speakingHistory: Readonly<SpeakingHistoryEntry[]>): void {
		if (Array.isArray(speakingHistory)) {
			this.props.setSpeakingHistory(speakingHistory);
		} else {
			throw new TypeError(`speakingHistory is not an array: (${typeof speakingHistory}) ${JSON.stringify(speakingHistory, null, 0)}`);
		}
	}

	updateSpeakingEventData(actionData: Readonly<SpeakingHistoryEntry>): void {
		this.props.setMostRecent(actionData);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	updateSpeakingEventPartData(_actionData: Readonly<SpeakingEventPartData>): void {
		// TODO: make use of this event listener.
		// TODO: should pitch/rate be part of mostRecent and/or SpeakingHistoryEntry?
		//this.props.setMostRecentPitch(actionData.pitch);
		//this.props.setMostRecentRate(actionData.rate);

		// TODO: expand properties, use to highlight text as it is spoken?
		// this.props.setMostRecentTextPart(actionData.textPart);
		// this.props.setMostRecentTextPartIndex(actionData.textPartIndex);
		// this.props.setMostRecentVoiceName(actionData.actualVoice);
	}

	async registerBroadcastListeners(): Promise<void> {
		const t = [
			startCrowdee(
				this.context.messageBusProviderGetter,
				"broadcaster:history:changed",
				(
					_actionName,
					// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
					actionData: Readonly<SpeakingHistoryEntry[]>,
				) => {
					this.setSpeakingHistory(actionData);
				}),

			startCrowdee(
				this.context.messageBusProviderGetter,
				"broadcaster:history:most-recent:changed",
				(
					_actionName,
					actionData: Readonly<SpeakingHistoryEntry>,
				) => {
					this.updateSpeakingEventData(actionData);
				}),

			startCrowdee(
				this.context.messageBusProviderGetter,
				"broadcaster:speaking:part:before",
				(
					_actionName,
					// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
					actionData: Readonly<SpeakingEventPartData>,
				) => {
					this.updateSpeakingEventPartData(actionData);
				}),
		];

		const u = await Promise.all(t.flat());

		this._uninitializers.unshift(...u.flat());
	}
}
