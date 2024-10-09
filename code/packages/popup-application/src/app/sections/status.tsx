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

import Icon from "@talkie/shared-ui/components/icon/icon.js";
import ProgressContainer from "@talkie/shared-ui/containers/progress-container.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as tableBase from "@talkie/shared-ui/styled/table/table-base.js";
import {
	withTalkieStyleDeep,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import {
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import React from "react";

export interface StatusProps {
	isSpeaking: boolean;
	playPauseClick: () => void;
}

class Status<P extends StatusProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	private readonly styled: {
		statusIconWrapper: TalkieStyletronComponent<typeof buttonBase.transparentButton>;
		table: TalkieStyletronComponent<typeof tableBase.wideTable>;
		tbody: TalkieStyletronComponent<typeof tableBase.tbody>;
		td: TalkieStyletronComponent<typeof tableBase.td>;
		tr: TalkieStyletronComponent<typeof tableBase.tr>;
	};

	constructor(props: P) {
		super(props);

		this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);

		this.styled = {
			statusIconWrapper: withTalkieStyleDeep(
				buttonBase.transparentButton,
				{
					paddingRight: "1em",
				},
			),

			table: withTalkieStyleDeep(
				tableBase.wideTable,
				{
					borderSpacing: 0,
				},
			),

			tbody: withTalkieStyleDeep(
				tableBase.tbody,
				{
					borderSpacing: 0,
				},
			),

			td: withTalkieStyleDeep(
				tableBase.td,
				{
					borderSpacing: 0,
					paddingBottom: 0,
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: 0,
				},
			),

			tr: withTalkieStyleDeep(
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
			configure,
			isSpeaking,
			translateSync,
		} = this.props as P;

		const statusIconClassName = `icon-small-${isSpeaking ? "stop" : "play"}`;

		return (
			<layoutBase.main>
				<p>
					{translateSync("frontend_PopupUsageShort")}
				</p>

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
										className={statusIconClassName}
										mode="standalone"
									/>
								</this.styled.statusIconWrapper>
							</this.styled.td>
							<this.styled.td>
								<a
									href={configure("urls.internal.options-status")}
									rel="noopener noreferrer"
									target="_blank"
								>
									<ProgressContainer/>
								</a>
							</this.styled.td>
						</this.styled.tr>
					</this.styled.tbody>
				</this.styled.table>
			</layoutBase.main>
		);
	}
}

export default configureAttribute<StatusProps & ConfigureProps>()(
	translateAttribute<StatusProps & ConfigureProps & TranslateProps>()(
		Status,
	),
);
