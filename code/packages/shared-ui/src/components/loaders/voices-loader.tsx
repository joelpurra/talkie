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

import toolkit from "@reduxjs/toolkit";
import {
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import selectors from "../../selectors/index.mjs";
import {
	actions,
} from "../../slices/index.mjs";
import {
	type SharedRootState,
} from "../../store/index.mjs";

const {
	bindActionCreators,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface VoicesLoaderProps {}

interface VoicesLoaderState {
	loadVoicesAttemptCount: number;
}

interface StateProps {
	haveVoices: boolean;
	voicesCount: number;
}

interface DispatchProps {
	loadVoices: typeof actions.voices.loadVoices;
}

interface InternalProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, SharedRootState> = (state: Readonly<SharedRootState>) => ({
	haveVoices: selectors.voices.getHaveVoices(state),
	voicesCount: selectors.voices.getVoicesCount(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	loadVoices: bindActionCreators(actions.voices.loadVoices, dispatch),
});

class VoicesLoader<P extends InternalProps, S extends VoicesLoaderState> extends React.PureComponent<P, S> {
	override state = (
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		{
			loadVoicesAttemptCount: 0,
		} as S
	);

	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// https://nodejs.org/api/timers.html#timers_class_timeout
	// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _voiceLoadTimeoutId: any | null;

	constructor(props: P) {
		super(props);

		this.componentCleanup = this.componentCleanup.bind(this);
	}

	override componentDidMount(): void {
		// TODO: is this the best place to load data?
		this.props.loadVoices();
	}

	override componentDidUpdate(previousProps: P, previousState: S): void {
		if (this.props.voicesCount !== previousProps.voicesCount) {
			const voicesCountDiff = this.props.voicesCount - previousProps.voicesCount;

			void logDebug(`Found ${this.props.voicesCount} voices (${voicesCountDiff > 0 ? "+" : ""}${voicesCountDiff}) during load attempt ${this.state.loadVoicesAttemptCount}.`);
		}

		// NOTE: sometimes the browser has not actually loaded the voices (cold cache), and will instead synchronously return an empty array.
		// NOTE: aggressively retry loading voices, as long as the component is being rendered, but gradually back off.
		// NOTE: not setting a maximum for retries, since the delay increases exponentially anyhow.
		const shouldRetryLoadingVoices = !this.props.haveVoices
			&& (
				this.state.loadVoicesAttemptCount === 0
				|| previousState.loadVoicesAttemptCount !== this.state.loadVoicesAttemptCount
			);

		if (shouldRetryLoadingVoices) {
			// NOTE: wait a bit between retries, both to allow any voices to load, and to not bog down the system with a loop if there actually are no voices.
			const loadVoicesRetryDelay = 100 * (2 ** this.state.loadVoicesAttemptCount);

			// NOTE: execute outside the synchronous rendering.
			this._voiceLoadTimeoutId = setTimeout(
				() => {
					this.setState(
						(state) => ({
							loadVoicesAttemptCount: state.loadVoicesAttemptCount + 1,
						}),
						() => {
							// TODO: is this the best place to load data?
							this.props.loadVoices();
						},
					);
				},
				loadVoicesRetryDelay,
			);
		}
	}

	override componentWillUnmount(): void {
		this.componentCleanup();
	}

	componentCleanup() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		clearTimeout(this._voiceLoadTimeoutId);
	}

	override render(): React.ReactNode {
		// TODO: hook in to react lifecycle, without faking a react component?
		return null;
	}
}

export default connect<StateProps, DispatchProps, InternalProps, SharedRootState>(mapStateToProps, mapDispatchToProps)(
	VoicesLoader,
) as unknown as React.ComponentType<VoicesLoaderProps>;
