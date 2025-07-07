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

import type {
	SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import type {
	TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import type {
	StyleObject,
} from "styletron-react";

import {
	KnownSettingDefaults,
	KnownSettingRanges,
} from "@talkie/shared-application/settings.mjs";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import {
	withTalkieStyleDeep,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import InputWithLabel from "../../../components/form/input-with-label.js";
import {
	type actions,
} from "../../../slices/index.mjs";

export interface SpeakingHistoryLimitProps {
	clearSpeakingHistory: typeof actions.shared.history.clearSpeakingHistory;
	disabled: boolean;
	onChange: (speakingHistoryLimit: number) => void;
	removeSpeakingHistoryEntry: typeof actions.shared.history.removeSpeakingHistoryEntry;
	speakingHistory: readonly SpeakingHistoryEntry[];
	speakingHistoryCount: number;
	speakingHistoryLimit: number;
}

class SpeakingHistoryLimit<P extends SpeakingHistoryLimitProps & TranslateProps> extends React.PureComponent<P> {
	private static get _speakingHistoryLimitMin() {
		return KnownSettingRanges.SpeakingHistoryLimit.min;
	}

	private static get _speakingHistoryLimitMax() {
		return KnownSettingRanges.SpeakingHistoryLimit.max;
	}

	private static get _speakingHistoryLimitStep() {
		return KnownSettingRanges.SpeakingHistoryLimit.step;
	}

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
			verticalAlign: "text-top",
			whiteSpace: "nowrap",
		};

		this.styled = {
			transparentButtonEllipsis: withTalkieStyleDeep(
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

		if (speakingHistoryLimit < SpeakingHistoryLimit._speakingHistoryLimitMin) {
			throw new RangeError(`speakingHistoryLimit: ${JSON.stringify(speakingHistoryLimit)}`);
		}

		if (speakingHistoryLimit > SpeakingHistoryLimit._speakingHistoryLimitMax) {
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
			translateSync,
		} = this.props as P;

		return (
			<>
				<textBase.h2>
					{translateSync("frontend_voicesSpeakingHistoryLimitHeading")}
				</textBase.h2>
				<p>
					{translateSync("frontend_voicesSpeakingHistoryLimitExplanation01")}
				</p>
				<p>
					{translateSync("frontend_voicesSpeakingHistoryLimitExplanation02", [
						KnownSettingDefaults.SpeakingHistoryLimit.toString(10),
					])}
				</p>
				<p>
					<InputWithLabel
						disabled={disabled}
						max={SpeakingHistoryLimit._speakingHistoryLimitMax}
						min={SpeakingHistoryLimit._speakingHistoryLimitMin}
						step={SpeakingHistoryLimit._speakingHistoryLimitStep}
						style={{
							// TODO: remove inline styles because `style-src: 'unsafe-inline';` isn't supported in MV3.
							// TODO: pass extra CSS className property styling to the inner element.
							width: "5em",
						}}
						type="number"
						value={speakingHistoryLimit.toString(10)}
						onChange={this.handleChange}
					>
						{translateSync("frontend_voicesSpeakingHistoryLimitLabel")}
					</InputWithLabel>
				</p>
				<p>
					{translateSync("frontend_voicesSpeakingHistoryLimitExplanation03", [
						speakingHistoryCount.toString(10),
					])}
				</p>
				<p>
					<buttonBase.button
						disabled={speakingHistoryCount === 0}
						onClick={this.handleClearSpeakingHistory}
					>
						{translateSync("frontend_voicesSpeakingHistoryForgetLabel", [
							speakingHistoryCount.toString(10),
						])}
					</buttonBase.button>
				</p>

				<details>
					<summary>
						{translateSync("frontend_voicesSpeakingHistoryForgetAllHeading")}
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
			</>
		);
	}
}

export default translateAttribute<SpeakingHistoryLimitProps & TranslateProps>()(
	SpeakingHistoryLimit,
);
