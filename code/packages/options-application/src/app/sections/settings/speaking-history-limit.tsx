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
	KnownSettingDefaults,
} from "@talkie/shared-application/settings-manager.mjs";
import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import React from "react";
import {
	type StyleObject,
	withStyleDeep,
} from "styletron-react";

import InputWithLabel from "../../../components/form/input-with-label.js";
import {
	type actions,
} from "../../../slices/index.mjs";

export interface SpeakingHistoryLimitProps {
	clearSpeakingHistory: typeof actions.shared.speaking.clearSpeakingHistory;
	disabled: boolean;
	onChange: (speakingHistoryLimit: number) => void;
	removeSpeakingHistoryEntry: typeof actions.shared.speaking.removeSpeakingHistoryEntry;
	speakingHistory: SpeakingHistoryEntry[];
	speakingHistoryCount: number;
	speakingHistoryLimit: number;
}

class SpeakingHistoryLimit<P extends SpeakingHistoryLimitProps & TranslateProps> extends React.PureComponent<P> {
	private readonly styled: {
		transparentButtonEllipsis: TalkieStyletronComponent<typeof buttonBase.transparentButton>;
	};

	constructor(props: P) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleClearSpeakingHistory = this.handleClearSpeakingHistory.bind(this);
		this.handleRemoveHistoryEntryClick = this.handleRemoveHistoryEntryClick.bind(this);

		const ellipsisWrapper: StyleObject = {
			// TODO: share ellipsis wrapper style.
			maxWidth: "100%",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		};

		this.styled = {
			transparentButtonEllipsis: withStyleDeep(
				buttonBase.transparentButton,
				ellipsisWrapper,
			),
		};
	}

	handleChange(speakingHistoryLimitValue: unknown): void {
		let speakingHistoryLimit: number | null = null;

		if (typeof speakingHistoryLimitValue === "number") {
			speakingHistoryLimit = speakingHistoryLimitValue;
		} else if (typeof speakingHistoryLimitValue === "string") {
			speakingHistoryLimit = Number.parseInt(speakingHistoryLimitValue, 10);
		}

		if (typeof speakingHistoryLimit !== "number" || Number.isNaN(speakingHistoryLimit)) {
			throw new TypeError(`speakingHistoryLimit: ${JSON.stringify(speakingHistoryLimit)}`);
		}

		// TODO: share range limit values with files.
		if (speakingHistoryLimit < 0) {
			throw new RangeError(`speakingHistoryLimit: ${JSON.stringify(speakingHistoryLimit)}`);
		}

		// TODO: share range limit values with files.
		if (speakingHistoryLimit > 100) {
			throw new RangeError(`speakingHistoryLimit: ${JSON.stringify(speakingHistoryLimit)}`);
		}

		this.props.onChange(speakingHistoryLimit);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleRemoveHistoryEntryClick(speakingHistoryEntry: SpeakingHistoryEntry, event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		const {
			hash,
		} = speakingHistoryEntry;

		this.props.removeSpeakingHistoryEntry(hash);

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleClearSpeakingHistory(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.clearSpeakingHistory();

		return false;
	}

	override render(): React.ReactNode {
		const {
			speakingHistory,
			speakingHistoryCount,
			speakingHistoryLimit,
			disabled,
			translatePlaceholderSync,
		} = this.props;

		return (
			<>
				<textBase.h2>
					{translatePlaceholderSync("History" /* "frontend_voicesSpeakingHistoryLimitHeading" */)}
				</textBase.h2>
				<p>
					{translatePlaceholderSync("Talkie can remember previously spoken text, so it can be replayed later. This setting limits how many history entries are remembered." /* "frontend_voicesSpeakingHistoryLimitExplanation01" */)}
				</p>
				<p>
					{translatePlaceholderSync(`The default limit is ${KnownSettingDefaults.SpeakingHistoryLimit}. Lower the limit to instantly reduce the number of history entries. A limit of 0 disables remembering the history.` /* "frontend_voicesSpeakingHistoryLimitExplanation02" */)}
				</p>
				<p>
					<InputWithLabel
						disabled={disabled}
						max={100}
						min={0}
						step={10}
						style={{
							// TODO: pass extra CSS className property styling to the inner element.
							width: "5em",
						}}
						type="number"
						value={speakingHistoryLimit.toString(10)}
						onChange={this.handleChange}
					>
						{translatePlaceholderSync("History entry limit" /* "frontend_voicesSpeakingHistoryLimitLabel" */)}
					</InputWithLabel>
				</p>
				<p>
					{translatePlaceholderSync(`There are currently ${speakingHistoryCount} history entries remembered. You can forget all at once, or forget individual entries.` /* "frontend_voicesSpeakingHistoryLimitExplanation04" */)}
				</p>
				<p>
					<buttonBase.button
						disabled={speakingHistoryCount === 0}
						onClick={this.handleClearSpeakingHistory}
					>
						{translatePlaceholderSync(`Forget all ${speakingHistoryCount} history entries` /* "frontend_voicesSpeakingHistoryLimitLabel" */)}
					</buttonBase.button>
				</p>
				<p>
					<details>
						<summary>
							{translatePlaceholderSync("Forget individual history entries")}
						</summary>

						<listBase.ol>
							{
								speakingHistory
									.map(
										(speakingHistoryEntry: Readonly<SpeakingHistoryEntry>) => {
											const {
												hash,
												text,
											} = speakingHistoryEntry;

											return (
												<listBase.li
													key={hash}
												>
													<this.styled.transparentButtonEllipsis
														// eslint-disable-next-line react/jsx-no-bind
														onClick={this.handleRemoveHistoryEntryClick.bind(null, speakingHistoryEntry)}
													>
														❌
														{" "}
														{text}
													</this.styled.transparentButtonEllipsis>
												</listBase.li>
											);
										},
									)
							}
						</listBase.ol>
					</details>
				</p>
			</>
		);
	}
}

export default translateAttribute<SpeakingHistoryLimitProps & TranslateProps>()(
	SpeakingHistoryLimit,
);
