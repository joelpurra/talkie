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
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import HistoryListener, {
	type HistoryListenerDispatchProps,
} from "../components/listeners/history-listener.js";
import {
	actions,
} from "../slices/index.mjs";
import {
	type SharedRootState,
} from "../store/index.mjs";

const {
	bindActionCreators,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HistoryListenerProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StateProps {}

interface DispatchProps extends HistoryListenerDispatchProps {}

interface InternalProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, SharedRootState> = (_state: Readonly<SharedRootState>) => ({});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	setMostRecent: bindActionCreators(actions.history.setMostRecent, dispatch),
	setSpeakingHistory: bindActionCreators(actions.history.setSpeakingHistory, dispatch),
});

class HistoryListenerContainer<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			setMostRecent,
			setSpeakingHistory,
		} = this.props;

		return (
			<HistoryListener
				setMostRecent={setMostRecent}
				setSpeakingHistory={setSpeakingHistory}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, SharedRootState>(mapStateToProps, mapDispatchToProps)(
	HistoryListenerContainer,
) as unknown as React.ComponentType<HistoryListenerProps>;
