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
	TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import {
	TalkieProgressData,
} from "@talkie/shared-ui/talkie-progress.mjs";
import React from "react";
import {
	styled,
} from "styletron-react";

export interface StatusProps extends TalkieProgressData {}

export default class Status<P extends StatusProps> extends React.PureComponent<P> {
	private readonly styled: {
		progress: TalkieStyletronComponent<"progress">;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			progress: styled(
				"progress",
				{
					height: "0.5em",
					marginBottom: "0.5em",
					marginTop: "0.5em",
					width: "100%",
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			// TODO: remove min from TalkieProgressData?
			// min,
			current,
			max,
		} = this.props as StatusProps;

		return (
			<this.styled.progress
				max={max}
				// min={min}
				value={current}
			/>
		);
	}
}
