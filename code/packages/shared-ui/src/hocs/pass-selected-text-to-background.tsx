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
	startResponder,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	promiseDelay,
} from "@talkie/shared-application-helpers/promise.mjs";
import {
	executeUninitializers,
} from "@talkie/shared-application-helpers/uninitializer-handler.mjs";
import {
	type UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";
import React from "react";

import {
	MessageBusContext,
} from "../containers/providers.js";
import getSelectedTextAndLanguageCodes from "../utils/get-selected-text-and-languages.mjs";
import {
	type PerhapsSelectedTextWithFocusTimestamp,
} from "./pass-selected-text-to-background-types.mjs";

// eslint-disable-next-line @typescript-eslint/ban-types
export default function passSelectedTextToBackgroundAttribute<P = {}, S = {}, SS = unknown>() {
	// eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/prefer-readonly-parameter-types
	return function passSelectedTextToBackgroundHoc(ComponentToWrap: React.ComponentType<P>) {
		class PassSelectedTextToBackgroundHoc extends React.PureComponent<P, S, SS> {
			static override contextType = MessageBusContext;

			// eslint-disable-next-line react/static-property-placement
			declare context: React.ContextType<typeof MessageBusContext>;

			private readonly _uninitializers: UninitializerCallback[] = [];
			private _isListeningToMessageBus = false;
			private _mostRecentUse = 0;

			constructor(props: P) {
				super(props);

				this.componentCleanup = this.componentCleanup.bind(this);
				this.handleFocus = this.handleFocus.bind(this);
				this.enable = this.enable.bind(this);
				this.disable = this.disable.bind(this);
				this.getSelectedTextWithFocusTimestamp = this.getSelectedTextWithFocusTimestamp.bind(this);
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
				this._mostRecentUse = Date.now();
			}

			enable() {
				// TODO: properly avoid race conditions when enabling/disabling.
				if (this._isListeningToMessageBus) {
					return;
				}

				void this.registerMessageBusListeners();
				this._isListeningToMessageBus = true;
			}

			disable() {
				// TODO: properly avoid race conditions when enabling/disabling.
				if (!this._isListeningToMessageBus) {
					return;
				}

				this._isListeningToMessageBus = false;

				// TODO: await uninitializers?
				void executeUninitializers(this._uninitializers);
			}

			override render(): React.ReactNode {
				return (
					<ComponentToWrap
						{...this.props}
					/>
				);
			}

			async getSelectedTextWithFocusTimestamp(): Promise<PerhapsSelectedTextWithFocusTimestamp | null> {
				if (!this._isListeningToMessageBus) {
					return null;
				}

				const selectionTextAndLanguageCode = getSelectedTextAndLanguageCodes();

				if (!selectionTextAndLanguageCode) {
					return null;
				}

				const selectedTextWithFocusTimestamp: PerhapsSelectedTextWithFocusTimestamp = {
					mostRecentUse: this._mostRecentUse,
					selectionTextAndLanguageCode,
				};

				// HACK: chrome only uses the first reply (like Promise.race()); delay messages to increase chances that the most recently used tab reacts first.
				// NOTE: example values:
				// - 1 second ago => 1,000 milliseconds => log2() => ~10 => *10 => delay 100 milliseconds.
				// - 30 seconds ago =>  30,000 ms => ~15 => delay 150 ms.
				// - 1 hour ago =>  3,600,000 ms => ~22 => delay 210 ms.
				// NOTE: this workaround doesn't work for the current webextension implementation, which allows multiple response (like Promise.all()) values but instead filters "usable" values to pick a single response.
				const timeSinceUse = Date.now() - this._mostRecentUse;
				const delay = Math.log2(Math.abs(timeSinceUse)) * 10;
				await promiseDelay(delay);

				return selectedTextWithFocusTimestamp;
			}

			async registerMessageBusListeners() {
				const uninitializers = await startResponder(this.context.messageBusProviderGetter, "dom:internal:passSelectedTextToBackground", async () => this.getSelectedTextWithFocusTimestamp());

				this._uninitializers.unshift(...uninitializers);
			}
		}

		return PassSelectedTextToBackgroundHoc as unknown as React.ComponentClass<P, S>;
	};
}
