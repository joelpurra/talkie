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

import Icon from "@talkie/shared-ui/components/icon/icon.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as tableBase from "@talkie/shared-ui/styled/table/table-base.js";
import * as lighter from "@talkie/shared-ui/styled/text/lighter.js";
import React, {
	ComponentProps,
} from "react";
import type {
	StyletronComponent,
} from "styletron-react";
import {
	withStyleDeep,
} from "styletron-react";

import ProgressContainer from "../../containers/progress-container.js";

export interface StatusProps {
	playPauseClick: () => void;
}

class Status<P extends StatusProps & TranslateProps> extends React.PureComponent<P> {
	private readonly styled: {
		statusIconWrapper: StyletronComponent<ComponentProps<typeof buttonBase.transparentButton>>;
		table: StyletronComponent<ComponentProps<typeof tableBase.wideTable>>;
		tbody: StyletronComponent<ComponentProps<typeof tableBase.tbody>>;
		td: StyletronComponent<ComponentProps<typeof tableBase.td>>;
		tr: StyletronComponent<ComponentProps<typeof tableBase.tr>>;
	};

	constructor(props: P) {
		super(props);

		this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);

		this.styled = {
			statusIconWrapper: withStyleDeep(
				buttonBase.transparentButton,
				{
					paddingRight: "1em",
				},
			),

			table: withStyleDeep(
				tableBase.wideTable,
				{
					borderSpacing: 0,
				},
			),

			tbody: withStyleDeep(
				tableBase.tbody,
				{
					borderSpacing: 0,
				},
			),

			td: withStyleDeep(
				tableBase.td,
				{
					borderSpacing: 0,
					paddingBottom: 0,
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: 0,
				},
			),

			tr: withStyleDeep(
				tableBase.tr,
				{
					borderSpacing: 0,
				},
			),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handlePlayPauseClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.playPauseClick();

		return false;
	}

	override render(): React.ReactNode {
		const {
			translateSync,
		} = this.props;

		return (
			<layoutBase.main>
				<lighter.p>
					{translateSync("frontend_PopupUsageShort")}
				</lighter.p>

				<this.styled.table>
					<colgroup>
						<col width="0*"/>
						<col width="100%"/>
					</colgroup>
					<this.styled.tbody>
						<this.styled.tr>
							<this.styled.td>
								<this.styled.statusIconWrapper
									type="button"
									onClick={this.handlePlayPauseClick}
								>
									<Icon
										className="icon-talkie-status"
										mode="standalone"
									/>
								</this.styled.statusIconWrapper>
							</this.styled.td>
							<this.styled.td>
								<ProgressContainer/>
							</this.styled.td>
						</this.styled.tr>
					</this.styled.tbody>
				</this.styled.table>
			</layoutBase.main>
		);
	}
}

export default translateAttribute<StatusProps & TranslateProps>()(
	Status,
);
