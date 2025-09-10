/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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
	OsType,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import type {
	TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import type {
	OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";

import Discretional from "@talkie/shared-ui/components/discretional.js";
import Icon from "@talkie/shared-ui/components/icon/icon.js";
import TalkieEditionIcon from "@talkie/shared-ui/components/icon/talkie-edition-icon.js";
import TalkiePremiumIcon from "@talkie/shared-ui/components/icon/talkie-premium-icon.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as tableBase from "@talkie/shared-ui/styled/table/table-base.js";
import {
	withTalkieStyleDeep,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import PremiumSection from "../../components/section/premium-section.js";

export interface UsageProps {
	isPremiumEdition: boolean;
	osType?: OsType | null;
	systemType: SystemType | null;
	onOpenShortKeysConfigurationClick: OnOpenShortcutKeysClickProp;
}

class Usage<P extends UsageProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		osType: null,
	};

	private readonly styled: {
		shortcutKeysTable: TalkieStyletronComponent<typeof tableBase.wideTable>;
		shortcutKeysTd: TalkieStyletronComponent<typeof tableBase.td>;
	};

	constructor(props: P) {
		super(props);

		this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);

		this.styled = {
			shortcutKeysTable: withTalkieStyleDeep(
				tableBase.wideTable,
				{
					borderSpacing: 0,
				},
			),

			shortcutKeysTd: withTalkieStyleDeep(
				tableBase.td,
				{
					whiteSpace: "nowrap",
				},
			),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOpenShortKeysConfigurationClick(event: Readonly<React.MouseEvent>): false {
		return this.props.onOpenShortKeysConfigurationClick(event);
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			systemType,
			osType,
			configure,
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			translatePlaceholderSync,
			translateSync,
		} = this.props as P;

		// TODO: can these key abbreviations be translated reliably?
		const translatedKeyAlt = translatePlaceholderSync("Alt");
		const translatedKeyCtrl = translatePlaceholderSync("Ctrl");
		const translatedKeyShift = translatePlaceholderSync("Shift");

		return (
			<>
				<textBase.h1>
					{translateSync("frontend_usageLinkText")}
				</textBase.h1>

				<section>
					<listBase.ul>
						<listBase.li>
							{translateSync("frontend_usageStep01")}
						</listBase.li>
						<listBase.li>
							{translateSync("frontend_usageStep02")}
							<TalkieEditionIcon
								isPremiumEdition={isPremiumEdition}
								mode="inline"
							/>
						</listBase.li>
					</listBase.ul>
					<p>
						{translateSync("frontend_usageSelectionContextMenuDescription")}
					</p>

					<PremiumSection
						mode="p"
					>
						<p>
							{translateSync("frontend_usageSpeakFromClipboard")}
						</p>
					</PremiumSection>

					<textBase.h2>
						{translateSync("frontend_usageShortcutHeading")}
					</textBase.h2>

					<p>
						{translateSync("frontend_usageShortcutKeyDescription")}
					</p>

					<this.styled.shortcutKeysTable>
						<colgroup>
							<col width="100%"/>
							<col width="0*"/>
						</colgroup>
						<tableBase.tbody>
							<tableBase.tr>
								<tableBase.td>
									<Icon
										className="icon-small-play"
										mode="inline"/>
									/
									<Icon
										className="icon-small-stop"
										mode="inline"/>

									{translateSync("frontend_usageShortcutKeyDescriptionStartStopWithMenu")}
								</tableBase.td>
								<this.styled.shortcutKeysTd>
									<textBase.kbd>
										{osType === "mac" ? "⌥" : translatedKeyAlt}
									</textBase.kbd>
									+
									<textBase.kbd>
										{translatedKeyShift}
									</textBase.kbd>
									+
									<textBase.kbd>
										A
									</textBase.kbd>
								</this.styled.shortcutKeysTd>
							</tableBase.tr>

							{/* NOTE: Shortcut key already in use in Firefox */}
							<Discretional
								enabled={systemType === "chrome"}
							>
								<tableBase.tr>
									<tableBase.td>
										<Icon
											className="icon-small-play"
											mode="inline"/>
										/
										<Icon
											className="icon-small-stop"
											mode="inline"/>

										{translateSync("frontend_usageShortcutKeyDescriptionStartStopWithoutMenu")}
									</tableBase.td>
									<this.styled.shortcutKeysTd>
										<textBase.kbd>
											{osType === "mac" ? "⌘" : translatedKeyCtrl}

										</textBase.kbd>
										+
										<textBase.kbd>
											{translatedKeyShift}
										</textBase.kbd>
										+
										<textBase.kbd>
											A
										</textBase.kbd>
									</this.styled.shortcutKeysTd>
								</tableBase.tr>
							</Discretional>

							<tableBase.tr className="premium-section">
								<tableBase.td colSpan={2}>
									<a
										href="#features"
										lang="en"
									>
										<TalkiePremiumIcon
											mode="inline"
										/>
										{translateSync("extensionShortName_Premium")}
									</a>
								</tableBase.td>
							</tableBase.tr>

							<tableBase.tr className="premium-section">
								<tableBase.td>
									{translateSync("frontend_usageShortcutKeyDescriptionSpeakFromClipboard")}
								</tableBase.td>
								<this.styled.shortcutKeysTd>
									<textBase.kbd>
										{osType === "mac" ? "⌘" : translatedKeyCtrl}
									</textBase.kbd>
									+
									<textBase.kbd>
										{translatedKeyShift}
									</textBase.kbd>
									+
									<textBase.kbd>
										1
									</textBase.kbd>
								</this.styled.shortcutKeysTd>
							</tableBase.tr>
						</tableBase.tbody>
					</this.styled.shortcutKeysTable>

					<p>
						{translateSync("frontend_usageShortcutKeyAlternative03")}
					</p>

					<p>
						{translateSync("frontend_usageShortcutKeyAlternative04")}
					</p>

					<p>
						<a
							href={configure("urls.external.shortcut-keys")}
							// NOTE: only handle the click in Chrome, as the feature can't be used in Firefox.
							onClick={systemType === "chrome" ? this.handleOpenShortKeysConfigurationClick : undefined}
						>
							{translateSync("frontend_usageShortcutKeyAlternative05")}
						</a>
					</p>
				</section>
			</>
		);
	}
}

export default configureAttribute<UsageProps & ConfigureProps>()(
	translateAttribute<UsageProps & ConfigureProps & TranslateProps>()(
		Usage,
	),
);
