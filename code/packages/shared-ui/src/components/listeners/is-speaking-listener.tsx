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
	startCrowdee,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	executeUninitializers,
} from "@talkie/shared-application-helpers/uninitializer-handler.mjs";
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
interface IsSpeakingListenerStateProps {}

export interface IsSpeakingListenerDispatchProps {
	setIsSpeaking: typeof actions.speaking.setIsSpeaking;
}

export default class IsSpeakingListener<P extends IsSpeakingListenerStateProps & IsSpeakingListenerDispatchProps> extends React.PureComponent<P> {
	static override contextType = MessageBusContext;

	// eslint-disable-next-line react/static-property-placement
	declare context: React.ContextType<typeof MessageBusContext>;

	// TODO: weak callback references?
	private readonly _uninitializers: UninitializerCallback[] = [];

	constructor(props: P) {
		super(props);

		this.componentCleanup = this.componentCleanup.bind(this);
		this.updateIsSpeaking = this.updateIsSpeaking.bind(this);
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

	updateIsSpeaking(isSpeaking: boolean): void {
		this.props.setIsSpeaking(isSpeaking);
	}

	async registerBroadcastListeners(): Promise<void> {
		const t = [
			startCrowdee(
				this.context.messageBusProviderGetter,
				"broadcaster:speaking:entire:before",
				() => {
					this.updateIsSpeaking(true);
				}),

			startCrowdee(
				this.context.messageBusProviderGetter,
				"broadcaster:speaking:part:before",
				() => {
					this.updateIsSpeaking(true);
				}),

			startCrowdee(
				this.context.messageBusProviderGetter,
				[
					"broadcaster:speaking:entire:after",
					"broadcaster:synthesizer:reset",
				],
				() => {
					this.updateIsSpeaking(false);
				}),
		];

		const u = await Promise.all(t.flat());

		this._uninitializers.unshift(...u.flat());
	}
}
