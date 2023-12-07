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
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	executeUninitializers,
} from "@talkie/shared-application-helpers/uninitializer-handler.mjs";
import type {
	UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";
import React from "react";
import type {
	Except,
	ReadonlyDeep,
} from "type-fest";

import {
	MessageBusContext,
} from "../containers/providers.js";
import type {
	TalkieProgressData,
} from "../talkie-progress.mjs";

export interface ProgressProps extends TalkieProgressData {}

interface ProgressHocState extends TalkieProgressData {}

export default function progressAttribute<P extends ProgressProps = ProgressProps, U = Except<P, keyof ProgressProps>>() {
	// eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/prefer-readonly-parameter-types
	return function progressHoc(ComponentToWrap: React.ComponentType<P>) {
		class ProgressHoc extends React.Component<P, ProgressHocState> {
			static override contextType = MessageBusContext;

			// eslint-disable-next-line react/static-property-placement
			declare context: React.ContextType<typeof MessageBusContext>;

			override state = {
				current: 0,
				max: 0,
				min: 0,
			};

			private _isListeningToBroadcasts = false;
			private readonly _uninitializers: UninitializerCallback[] = [];

			constructor(props: P) {
				super(props);

				this.componentCleanup = this.componentCleanup.bind(this);
			}

			override componentDidMount(): void {
				window.addEventListener("beforeunload", this.componentCleanup);

				void this.registerBroadcastListeners();
				this._isListeningToBroadcasts = true;
			}

			override componentWillUnmount(): void {
				this.componentCleanup();
			}

			componentCleanup(): void {
				window.removeEventListener("beforeunload", this.componentCleanup);
				this._isListeningToBroadcasts = false;

				void executeUninitializers(this._uninitializers);
			}

			override shouldComponentUpdate(
				_nextProps: P,
				_nextState: ReadonlyDeep<ProgressHocState>,
			): boolean {
				// NOTE: always update.
				// TODO: optimize by comparing old and new props/state.
				return this._isListeningToBroadcasts;
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
				if (!this._isListeningToBroadcasts) {
					return;
				}

				// NOTE: there seems to be some issues with react trying to re-render the page after the page has (will) unload.
				// NOTE: trigger by hitting the Talkie button in quick succession.
				// NOTE: This seems to be due to events from the background page having enough state to for the broadcaster to trigger events inside of the page, before (without) uninitializers being executed.
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
				} catch (error: unknown) {
					void logError("setState", "swallowing error", error);
				}
			}

			async registerBroadcastListeners(): Promise<void> {
				const uninitializers = await startCrowdee(
					this.context.messageBusProviderGetter,
					"broadcaster:progress:update",
					(_actionName: string, actionData: ReadonlyDeep<ProgressHocState>) => {
						this.updateProgress(actionData);
					},
				);

				this._uninitializers.unshift(...uninitializers);
			}
		}

		return ProgressHoc as unknown as React.ComponentClass<U>;
	};
}
