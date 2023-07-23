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

import React from "react";

import {
	type actions,
} from "../slices/index.mjs";
import isSpeakingAttribute from "./is-speaking.js";
import {
	type IsSpeakingProps,
} from "./is-speaking-types.mjs";

export interface IsSpeakingUpdaterStateProps extends IsSpeakingProps {
}

export interface IsSpeakingUpdaterDispatchProps {
	setIsSpeaking: typeof actions.speaking.setIsSpeaking;
}

class IsSpeakingUpdater<P extends IsSpeakingUpdaterStateProps & IsSpeakingUpdaterDispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidUpdate(previousProps: P): void {
		if (previousProps.isSpeaking !== this.props.isSpeaking) {
			this.props.setIsSpeaking(this.props.isSpeaking);
		}
	}

	override render(): React.ReactNode {
		return null;
	}
}

export default isSpeakingAttribute<IsSpeakingUpdaterStateProps & IsSpeakingUpdaterDispatchProps>()(
	IsSpeakingUpdater,
);
