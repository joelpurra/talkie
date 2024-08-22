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
	getLanguageGroupFromLanguage,
} from "@talkie/shared-application-helpers/transform-voices.mjs";
import {
	DefaultLanguageDirection,
	type LanguageTextDirection,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import type {
	SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import Icon from "@talkie/shared-ui/components/icon/icon.js";
import ProgressContainer from "@talkie/shared-ui/containers/progress-container.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as tableBase from "@talkie/shared-ui/styled/table/table-base.js";
import {
	withTalkieStyleDeep,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import type {
	TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import type {
	ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React from "react";
import type {
	StyleObject,
} from "styletron-react";

import MarkdownParagraph from "../../components/markdown/paragraph.js";
import type {
	actions,
} from "../../slices/index.mjs";

export interface StatusStateProps {
	isSpeaking: boolean;
	isSpeakingHistoryEnabled: boolean;
	mostRecent: SpeakingHistoryEntry | null;
	speakingHistory: Readonly<SpeakingHistoryEntry[]>;
	speakingHistoryCount: number;
}

export interface StatusDispatchProps {
	speakTextInVoiceWithOverrides: typeof actions.shared.speaking.speakTextInVoiceWithOverrides;
	stopSpeaking: typeof actions.shared.speaking.stopSpeaking;
}

interface InternalProps extends StatusDispatchProps, StatusStateProps, ConfigureProps, TranslateProps {}

class Status<P extends InternalProps> extends React.PureComponent<P> {
	static defaultProps = {
		mostRecent: null,
		speakingHistory: [],
	};

	private readonly styled: {
		centerTd: TalkieStyletronComponent<typeof tableBase.td>;
		transparentButtonEllipsis: TalkieStyletronComponent<typeof buttonBase.transparentButton>;
		transparentButtonEllipsisDisabled: TalkieStyletronComponent<typeof buttonBase.transparentButtonDisabled>;
	};

	constructor(props: P) {
		super(props);

		this.handleReplayClick = this.handleReplayClick.bind(this);
		this.handleStopSpeakingClick = this.handleStopSpeakingClick.bind(this);
		this.handleSpeakHistoryEntryClick = this.handleSpeakHistoryEntryClick.bind(this);

		const ellipsisWrapper: StyleObject = {
			// TODO: share ellipsis wrapper style.
			maxWidth: "100%",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		};

		this.styled = {
			centerTd: withTalkieStyleDeep(
				tableBase.td,
				{
					textAlign: "center",
				},
			),
			transparentButtonEllipsis: withTalkieStyleDeep(
				buttonBase.transparentButton,
				ellipsisWrapper,
			),
			transparentButtonEllipsisDisabled: withTalkieStyleDeep(
				buttonBase.transparentButtonDisabled,
				ellipsisWrapper,
			),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleReplayClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		const {
			speakTextInVoiceWithOverrides,
			mostRecent,
		} = this.props as P;

		if (!mostRecent) {
			throw new TypeError("mostRecentText");
		}

		if (typeof mostRecent.text !== "string") {
			throw new TypeError("mostRecent.text");
		}

		if (typeof mostRecent.voiceName !== "string") {
			throw new TypeError("mostRecent.voiceName");
		}

		// NOTE: using the frontend values instead of a backend lookup; backend my not have the most recent entry if history is disabled.
		// TODO: create speakTextInMostRecentVoice() in slice?
		speakTextInVoiceWithOverrides({
			text: mostRecent.text,
			voiceName: mostRecent.voiceName,
		});

		// TODO: should pitch/rate be part of mostRecent and/or SpeakingHistoryEntry?
		//speakTextInCustomVoice({
		//text: mostRecent.text,
		//voice: {
		//name: mostRecent.voiceName,
		//pitch: mostRecent.pitch,
		//rate: mostRecent.rate,
		//},
		//});

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleStopSpeakingClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.stopSpeaking();

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSpeakHistoryEntryClick(speakingHistoryEntry: SpeakingHistoryEntry, event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		const {
			text,
			voiceName,
		} = speakingHistoryEntry;

		if (typeof text !== "string" || text.length === 0 || text.trim().length === 0) {
			throw new TypeError("text");
		}

		// TODO: verify that the voice exists, at some level, and have a nice user error for the case of it not existing.
		if (typeof voiceName !== "string" || voiceName.length === 0 || voiceName.trim().length === 0) {
			throw new TypeError("voiceName");
		}

		// NOTE: using the frontend values instead of a backend lookup.
		// TODO: use single source of truth, meaning use backend values?
		this.props.speakTextInVoiceWithOverrides({
			text,
			voiceName,
		});

		return false;
	}

	// eslint-disable-next-line complexity
	override render(): React.ReactNode {
		const {
			isSpeaking,
			isSpeakingHistoryEnabled,
			mostRecent,
			speakingHistory,
			translatePlaceholderSync,
		} = this.props as InternalProps;

		// TODO: move to state/selector.
		const hasMostRecentText = mostRecent !== null
			&& typeof mostRecent.text === "string"
			&& mostRecent.text.length > 0
			&& mostRecent.text.trim().length > 0;

		// TODO: move to state/selector.
		const hasMostRecentLanguage = mostRecent !== null
				&& typeof mostRecent.language === "string"
				&& mostRecent.language.length > 0
				&& mostRecent.language.trim().length > 0;

		const mostRecentLanguageGroup = mostRecent !== null
			&& hasMostRecentLanguage
			? getLanguageGroupFromLanguage(mostRecent.language!)
			: null;

		// TODO: move to state/selector.
		const hasMostRecentLanguageGroup = typeof mostRecentLanguageGroup === "string"
			&& mostRecentLanguageGroup.length > 0
			&& mostRecentLanguageGroup.trim().length > 0;

		// TODO: don't create instance here.
		const talkieLocaleHelper = new TalkieLocaleHelper();

		// TODO: move to state/selector.
		const textDirectionForMostRecentLanguageGroup: LanguageTextDirection = hasMostRecentLanguageGroup && talkieLocaleHelper.isTalkieLocale(mostRecentLanguageGroup)
			// eslint-disable-next-line no-sync
			? talkieLocaleHelper.getBidiDirectionSync(mostRecentLanguageGroup)
			: DefaultLanguageDirection;
		const textDirectionClassNameForLanguageGroup = `text-direction-${textDirectionForMostRecentLanguageGroup}`;

		const stopButtonIconClassName = `icon-small-${isSpeaking ? "stop" : "stop-disabled"}`;
		// eslint-disable-next-line react/function-component-definition
		const StopButtonIcon: React.FC = () => (
			<Icon
				className={stopButtonIconClassName}
				mode="standalone"
			/>
		);

		const StopButtonState = isSpeaking
			? buttonBase.transparentButton
			: buttonBase.transparentButtonDisabled;

		// eslint-disable-next-line react/function-component-definition
		const StopButton: React.FC = () => (
			<StopButtonState
				// TODO: alt/title text?
				disabled={!isSpeaking}
				type="button"
				// eslint-disable-next-line react/no-this-in-sfc
				onClick={isSpeaking ? this.handleStopSpeakingClick : undefined}
			>
				<StopButtonIcon/>
			</StopButtonState>
		);

		const replayButtonIconClassName = `icon-small-${hasMostRecentText ? "replay" : "replay-disabled"}`;
		// eslint-disable-next-line react/function-component-definition
		const ReplayButtonIcon: React.FC = () => (
			<Icon
				className={replayButtonIconClassName}
				mode="standalone"
			/>
		);

		const ReplayButtonState = hasMostRecentText
			? buttonBase.transparentButton
			: buttonBase.transparentButtonDisabled;

		// eslint-disable-next-line react/function-component-definition
		const ReplayButton: React.FC = () => (
			<ReplayButtonState
				// TODO: alt/title text?
				disabled={!hasMostRecentText}
				type="button"
				// eslint-disable-next-line react/no-this-in-sfc
				onClick={hasMostRecentText ? this.handleReplayClick : undefined}
			>
				<ReplayButtonIcon/>
			</ReplayButtonState>
		);

		const fallbackDash: React.ReactNode = (
			<>
				&mdash;
			</>
		);

		// eslint-disable-next-line react/function-component-definition, @typescript-eslint/prefer-readonly-parameter-types
		const UseFallbackDash: React.FunctionComponent<ChildrenRequiredProps & {enabled: boolean}> = ({
			children,
			enabled,
		}) => (
			// eslint-disable-next-line react/jsx-no-useless-fragment
			<>
				{
					enabled
						? children
						: fallbackDash
				}
			</>
		);

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, react/function-component-definition
		const EmptyTextUseFallbackDash: React.FC<{text: string | null}> = ({
			text,
		}) =>
			(
				<UseFallbackDash
					enabled={typeof text === "string" && text.length > 0 && text.trim().length > 0}
				>
					{text}
				</UseFallbackDash>
			);

		return (
			<>
				<textBase.h1>
					{translatePlaceholderSync("Status" /* "frontend_statusLinkText" */)}
				</textBase.h1>

				<section>
					<tableBase.wideTable>
						<colgroup>
							{/* TODO: enable pitch/rate. */}
							{/* <col span={4} width="25%"/> */}
							<col span={2} width="50%"/>
						</colgroup>
						<tableBase.thead>
							<tableBase.tr>
								<tableBase.th>
									{translatePlaceholderSync("Language")}
								</tableBase.th>
								<tableBase.th>
									{translatePlaceholderSync("Voice")}
								</tableBase.th>
								{/* TODO: enable pitch/rate. */}
								{/*
							<tableBase.th>
								{translatePlaceholderSync("Pitch")}
							</tableBase.th>
							<tableBase.th>
								{translatePlaceholderSync("Speed")}
							</tableBase.th>
							*/}
							</tableBase.tr>
						</tableBase.thead>
						<tableBase.tbody>
							<tableBase.tr>
								<this.styled.centerTd>
									<EmptyTextUseFallbackDash
										text={mostRecent?.language ?? null}
									/>
								</this.styled.centerTd>
								<this.styled.centerTd>
									<EmptyTextUseFallbackDash
										text={mostRecent?.voiceName ?? null}
									/>
								</this.styled.centerTd>
								{/*
							<this.styled.centerTd>
								<UseFallbackDash
									enabled={hasMostRecentText}
								>
									{mostRecentPitch}
								</UseFallbackDash>
							</this.styled.centerTd>
							<this.styled.centerTd>
								<UseFallbackDash
									enabled={hasMostRecentText}
								>
									{mostRecentRate}
								</UseFallbackDash>
							</this.styled.centerTd>
							*/}
							</tableBase.tr>
						</tableBase.tbody>
					</tableBase.wideTable>

					<p>
						<ProgressContainer/>
					</p>

					<p>
						<ReplayButton/>
						<StopButton/>
					</p>

					<Discretional
						enabled={isSpeakingHistoryEnabled}
					>
						<details>
							<summary>
								{translatePlaceholderSync("History")}
								{" "}
								(
								{speakingHistory.length}
								)
							</summary>

							<listBase.ol>
								{
									speakingHistory
										.map(
											(speakingHistoryEntry: Readonly<SpeakingHistoryEntry>) => {
												const {
													hash,
													text,
													voiceName,
												} = speakingHistoryEntry;

												const hasTextAndVoice = typeof text === "string" && typeof voiceName === "string";
												const SpeakHistoryButtonState = hasTextAndVoice
													? this.styled.transparentButtonEllipsis
													: this.styled.transparentButtonEllipsisDisabled;

												return (
													<listBase.li
														key={hash}
														// eslint-disable-next-line react/jsx-no-bind
														onClick={hasTextAndVoice ? this.handleSpeakHistoryEntryClick.bind(null, speakingHistoryEntry) : undefined}
													>
														<SpeakHistoryButtonState>
															{text}
														</SpeakHistoryButtonState>
													</listBase.li>
												);
											},
										)
								}
							</listBase.ol>
						</details>
					</Discretional>

					<Discretional
						enabled={hasMostRecentText}
					>
						<textBase.blockquote
							className={textDirectionClassNameForLanguageGroup}
						>
							<MarkdownParagraph>
								{/* TODO: fix string type narrowing/detection based on hasMostRecentText? */}
								{(mostRecent !== null && typeof mostRecent.text === "string" && mostRecent.text.trim().length > 0 && mostRecent.text) || "NOTE: empty or no markdown string was provided."}
							</MarkdownParagraph>
						</textBase.blockquote>
					</Discretional>

					<Discretional
						enabled={!hasMostRecentText}
					>
						<p>
							{translatePlaceholderSync("There are no history entries.")}
						</p>
					</Discretional>
				</section>
			</>
		);
	}
}

export default configureAttribute<StatusDispatchProps & StatusStateProps & ConfigureProps>()(
	translateAttribute<StatusDispatchProps & StatusStateProps & ConfigureProps & TranslateProps>()(
		Status,
	),
);
