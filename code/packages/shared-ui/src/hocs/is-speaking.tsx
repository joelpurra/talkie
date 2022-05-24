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
	KillSwitch,
} from "@talkie/shared-interfaces/killswitch.mjs";
import {
	knownEvents,
} from "@talkie/shared-interfaces/known-events.mjs";
import React from "react";
import type {
	Except,
	ReadonlyDeep,
} from "type-fest";

import {
	BroadcasterContext,
} from "../containers/providers.js";
import {
	IsSpeakingHocState,
	IsSpeakingProps,
} from "./is-speaking-types.mjs";

export default function isSpeakingAttribute<P extends IsSpeakingProps = IsSpeakingProps, U = Except<P, keyof IsSpeakingProps>>() {
	// eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/prefer-readonly-parameter-types
	return function isSpeakingHoc(ComponentToWrap: React.ComponentType<P>) {
		class IsSpeakingHoc extends React.Component<P, IsSpeakingHocState> {
			static override contextType = BroadcasterContext;
			declare context: React.ContextType<typeof BroadcasterContext>;

			override state = {
				isSpeaking: false,
			};

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

			override shouldComponentUpdate(
				_nextProps: P,
				_nextState: ReadonlyDeep<IsSpeakingHocState>,
			): boolean {
				// NOTE: always update.
				// TODO: optimize by comparing old and new props/state.
				return this.isListeningToBroadcasts;
			}

			componentCleanup(): void {
				this.isListeningToBroadcasts = false;
				this.executeKillSwitches();
			}

			override render(): React.ReactNode {
				const {
					isSpeaking,
				} = this.state;

				return (
					<ComponentToWrap
						{...this.props}
						isSpeaking={isSpeaking}
					/>
				);
			}

			updateIsSpeaking(data: boolean): void {
				if (!this.isListeningToBroadcasts) {
					return;
				}

				// NOTE: there seems to be some issues with react trying to re-render the page after the page has (will) unload.
				// NOTE: trigger by hitting the Talkie button in quick succession.
				// NOTE: This seems to be due to events from the background page having enough state to for the broadcaster to trigger events inside of the page, before (without) killSwitches being executed.
				// NOTE: The code inside of react is tricky -- especially in dev mode -- and this try-catch might not do anything.
				// https://github.com/facebook/react/pull/10270
				// https://github.com/facebook/react/blob/37e4329bc81def4695211d6e3795a654ef4d84f5/packages/react-reconciler/src/ReactFiberScheduler.js#L770
				// https://github.com/facebook/react/blob/46b3c3e4ae0d52565f7ed2344036a22016781ca0/packages/shared/invokeGuardedCallback.js#L151-L161
				try {
					this.setState({
						isSpeaking: data,
					});
				} catch {
					// dualLogger.dualLogError("setState", error);

					// NOTE: ignoring and swallowing error.
				}
			}

			executeKillSwitches() {
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

		return IsSpeakingHoc as unknown as React.ComponentClass<U>;
	};
}
