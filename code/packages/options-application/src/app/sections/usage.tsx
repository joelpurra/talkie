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
	OsType,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import Icon from "@talkie/shared-ui/components/icon/icon.js";
import TalkieEditionIcon from "@talkie/shared-ui/components/icon/talkie-edition-icon.js";
import TalkiePremiumIcon from "@talkie/shared-ui/components/icon/talkie-premium-icon.js";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as tableBase from "@talkie/shared-ui/styled/table/table-base.js";
import * as lighter from "@talkie/shared-ui/styled/text/lighter.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";
import React, {
	ComponentProps,
} from "react";
import type {
	StyletronComponent,
} from "styletron-react";
import {
	withStyleDeep,
} from "styletron-react";

import PremiumSection from "../../components/section/premium-section.js";

export interface UsageProps {
	isPremiumEdition: boolean;
	osType?: OsType | null;
	systemType: SystemType | null;
	onOpenShortKeysConfigurationClick: OnOpenShortcutKeysClickProp;
}

class Usage<P extends UsageProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);

		this.styled = {
			shortcutKeysTable: withStyleDeep(
				tableBase.wideTable,
				{
					borderSpacing: 0,
				},
			),

			shortcutKeysTd: withStyleDeep(
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
			translateSync,
		} = this.props;

		return (
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

				{/* NOTE: read from clipboard feature not available in Firefox */}
				<Discretional
					enabled={systemType === "chrome"}
				>
					<PremiumSection
						mode="p"
					>
						<p>
							{translateSync("frontend_usageReadclipboard")}
						</p>
					</PremiumSection>
				</Discretional>

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
								<lighter.span>
									/
								</lighter.span>
								<Icon
									className="icon-small-stop"
									mode="inline"/>

								{translateSync("frontend_usageShortcutKeyDescriptionStartStopWithMenu")}
							</tableBase.td>
							<this.styled.shortcutKeysTd>
								<Discretional
									enabled={osType === "mac"}
								>
									<textBase.kbd>
										⌥
									</textBase.kbd>
								</Discretional>

								<Discretional
									enabled={osType !== "mac"}
								>
									<textBase.kbd>
										Alt
									</textBase.kbd>
								</Discretional>

								+
								<textBase.kbd>
									Shift
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
									<lighter.span>
										/
									</lighter.span>
									<Icon
										className="icon-small-stop"
										mode="inline"/>

									{translateSync("frontend_usageShortcutKeyDescriptionStartStopWithoutMenu")}
								</tableBase.td>
								<this.styled.shortcutKeysTd>
									<Discretional
										enabled={osType === "mac"}
									>
										<textBase.kbd>
											⌘
										</textBase.kbd>
									</Discretional>

									<Discretional
										enabled={osType !== "mac"}
									>
										<textBase.kbd>
											Ctrl
										</textBase.kbd>
									</Discretional>

									+
									<textBase.kbd>
										Shift
									</textBase.kbd>
									+
									<textBase.kbd>
										A
									</textBase.kbd>
								</this.styled.shortcutKeysTd>
							</tableBase.tr>
						</Discretional>

						{/* NOTE: read from clipboard feature not available in Firefox */}
						<Discretional
							enabled={systemType === "chrome"}
						>
							<tableBase.tr className="premium-section">
								<tableBase.td colSpan={2}>
									<textBase.a
										href="#features"
										lang="en"
									>
										<TalkiePremiumIcon
											mode="inline"
										/>
										{translateSync("extensionShortName_Premium")}
									</textBase.a>
								</tableBase.td>
							</tableBase.tr>
						</Discretional>

						{/* NOTE: read from clipboard feature not available in Firefox */}
						<Discretional
							enabled={systemType === "chrome"}
						>
							<tableBase.tr className="premium-section">
								<tableBase.td>
									<Icon
										className="icon-small-speaker"
										mode="inline"/>

									{translateSync("frontend_usageShortcutKeyDescriptionReadFromClipboard")}
								</tableBase.td>
								<this.styled.shortcutKeysTd>
									<Discretional
										enabled={osType === "mac"}
									>
										<textBase.kbd>
											⌘
										</textBase.kbd>
									</Discretional>

									<Discretional
										enabled={osType !== "mac"}
									>
										<textBase.kbd>
											Ctrl
										</textBase.kbd>
									</Discretional>

									+
									<textBase.kbd>
										Shift
									</textBase.kbd>
									+
									<textBase.kbd>
										1
									</textBase.kbd>
								</this.styled.shortcutKeysTd>
							</tableBase.tr>
						</Discretional>
					</tableBase.tbody>
				</this.styled.shortcutKeysTable>

				<lighter.p>
					{translateSync("frontend_usageShortcutKeyAlternative03")}
				</lighter.p>

				<p>
					<textBase.a
						href={configure("urls.external.shortcut-keys")}
						// NOTE: only handle the click in Chrome, as the feature can't be used in Firefox.
						onClick={systemType === "chrome" ? this.handleOpenShortKeysConfigurationClick : undefined}
					>
						{translateSync("frontend_usageShortcutKeyAlternative04")}
					</textBase.a>
				</p>
			</section>
		);
	}

	static defaultProps = {
		osType: null,
	};

	private readonly styled: {
		shortcutKeysTable: StyletronComponent<ComponentProps<typeof tableBase.wideTable>>;
		shortcutKeysTd: StyletronComponent<ComponentProps<typeof tableBase.td>>;
	};
}

export default configureAttribute<UsageProps & ConfigureProps>()(
	translateAttribute<UsageProps & ConfigureProps & TranslateProps>()(
		Usage,
	),
);
