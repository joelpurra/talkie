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
	TalkieProgressData,
} from "../talkie-progress.mjs";

export interface ProgressProps extends TalkieProgressData {}

type ProgressHocState = TalkieProgressData;

export default function progressAttribute<P extends ProgressProps = ProgressProps, U = Except<P, keyof ProgressProps>>() {
	// eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types
	return function progressHoc(ComponentToWrap: React.ComponentType<P>) {
		class ProgressHoc extends React.Component<P, ProgressHocState> {
			constructor(props: P) {
				super(props);

				this.componentCleanup = this.componentCleanup.bind(this);
			}

			override componentDidMount(): void {
				window.addEventListener("beforeunload", this.componentCleanup);

				void this.registerBroadcastListeners();
				this.isListeningToBroadcasts = true;
			}

			override componentWillUnmount(): void {
				this.componentCleanup();
			}

			componentCleanup(): void {
				window.removeEventListener("beforeunload", this.componentCleanup);
				this.isListeningToBroadcasts = false;
				this.executeKillSwitches();
			}

			override shouldComponentUpdate(
				_nextProps: P,
				_nextState: ReadonlyDeep<ProgressHocState>,
			): boolean {
				// NOTE: always update.
				// TODO: optimize by comparing old and new props/state.
				return this.isListeningToBroadcasts;
			}

			override render(): React.ReactNode {
				const {
					min,
					current,
					max,
				} = this.state;

				return (
					<ComponentToWrap
						{...this.props}
						current={current}
						max={max}
						min={min}
					/>
				);
			}

			updateProgress(data: ReadonlyDeep<ProgressHocState>): void {
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
						current: data.current,
						max: data.max,
						min: data.min,
					});
				} catch {
					// dualLogger.dualLogError("setState", error);

					// NOTE: ignoring and swallowing error.
				}
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
				const killSwitch = await this.context.broadcaster.registerListeningAction(
					knownEvents.updateProgress,
					(_actionName: string, actionData: ReadonlyDeep<ProgressHocState>) => {
						this.updateProgress(actionData);
					},
				);

				this.killSwitches.push(killSwitch);
			}

			static override contextType = BroadcasterContext;
			declare context: React.ContextType<typeof BroadcasterContext>;

			isListeningToBroadcasts = false;
			killSwitches: KillSwitch[] = [];

			override state = {
				current: 0,
				max: 0,
				min: 0,
			};
		}

		return ProgressHoc as unknown as React.ComponentClass<U>;
	};
}
