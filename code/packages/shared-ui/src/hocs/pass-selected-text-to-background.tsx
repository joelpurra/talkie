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
} from "../containers/providers.js";
import executeGetFramesSelectionTextAndLanguageCode from "./pass-selected-text-to-background-javascript.mjs";
import {
	type PerhapsSelectedTextWithFocusTimestamp,
} from "./pass-selected-text-to-background-types.mjs";

// eslint-disable-next-line @typescript-eslint/ban-types
export default function passSelectedTextToBackgroundAttribute<P = {}, S = {}, SS = unknown>() {
	// eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/prefer-readonly-parameter-types
	return function passSelectedTextToBackgroundHoc(ComponentToWrap: React.ComponentType<P>) {
		class PassSelectedTextToBackgroundHoc extends React.PureComponent<P, S, SS> {
			static override contextType = BroadcasterContext;

			// eslint-disable-next-line react/static-property-placement
			declare context: React.ContextType<typeof BroadcasterContext>;

			killSwitches: KillSwitch[];
			isListeningToBroadcasts: boolean;
			mostRecentUse: number;

			constructor(props: P) {
				super(props);

				this.componentCleanup = this.componentCleanup.bind(this);
				this.handleFocus = this.handleFocus.bind(this);
				this.enable = this.enable.bind(this);
				this.disable = this.disable.bind(this);
				this.getSelectedTextWithFocusTimestamp = this.getSelectedTextWithFocusTimestamp.bind(this);

				this.isListeningToBroadcasts = false;
				this.killSwitches = [];
				this.mostRecentUse = 0;
			}

			override componentDidMount(): void {
				window.addEventListener("beforeunload", this.componentCleanup);
				window.addEventListener("focus", this.handleFocus);

				this.gotFocus();

				this.enable();
			}

			override componentWillUnmount(): void {
				this.componentCleanup();
			}

			componentCleanup() {
				window.removeEventListener("beforeunload", this.componentCleanup);
				window.removeEventListener("focus", this.handleFocus);

				this.disable();
			}

			handleFocus() {
				this.gotFocus();
			}

			gotFocus() {
				this.mostRecentUse = Date.now();
			}

			enable() {
				// TODO: properly avoid race conditions when enabling/disabling.
				if (this.isListeningToBroadcasts) {
					return;
				}

				void this.registerBroadcastListeners();
				this.isListeningToBroadcasts = true;
			}

			disable() {
				// TODO: properly avoid race conditions when enabling/disabling.
				if (!this.isListeningToBroadcasts) {
					return;
				}

				this.isListeningToBroadcasts = false;
				this.executeKillSwitches();
			}

			override render(): React.ReactNode {
				return (
					<ComponentToWrap
						{...this.props}
					/>
				);
			}

			async getSelectedTextWithFocusTimestamp(): Promise<PerhapsSelectedTextWithFocusTimestamp | null> {
				if (!this.isListeningToBroadcasts) {
					return null;
				}

				const selectedTextWithFocusTimestamp = {
					mostRecentUse: this.mostRecentUse,
					selectionTextAndLanguageCode: executeGetFramesSelectionTextAndLanguageCode(),
				};

				return selectedTextWithFocusTimestamp;
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

			async registerBroadcastListeners() {
				const killSwitch = await this.context.broadcaster.registerListeningAction(
					knownEvents.passSelectedTextToBackground,
					async () => this.getSelectedTextWithFocusTimestamp(),
				);

				this.killSwitches.push(killSwitch);
			}
		}

		return PassSelectedTextToBackgroundHoc as unknown as React.ComponentClass<P, S>;
	};
}
