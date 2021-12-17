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
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
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

export interface SupportProps {
	onOpenShortKeysConfigurationClick: OnOpenShortcutKeysClickProp;
	osType?: OsType | null;
	systemType: SystemType | null;
}

class Support<P extends SupportProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);

		this.styled = {
			summaryHeading: withStyleDeep(
				textBase.h4,
				{
					display: "inline-block",
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					marginTop: 0,
					paddingBottom: "0.5em",
					paddingLeft: "0.5em",
					paddingRight: "0.5em",
					paddingTop: "0.5em",
				},
			),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOpenShortKeysConfigurationClick(event: React.MouseEvent): false {
		return this.props.onOpenShortKeysConfigurationClick(event);
	}

	standardFaqEntry(id: number): React.ReactNode {
		const {
			translateSync,
		} = this.props;

		const paddedId = id.toString(10).padStart(3, "0");

		return (
			<layoutBase.details>
				<layoutBase.summary>
					<this.styled.summaryHeading>
						{translateSync(`frontend_faq${paddedId}Q`)}
					</this.styled.summaryHeading>
				</layoutBase.summary>
				<textBase.p>
					{translateSync(`frontend_faq${paddedId}A`)}
				</textBase.p>
			</layoutBase.details>
		);
	}

	override render(): React.ReactNode {
		const {
			systemType,
			osType,
			translateSync,
			configure,
		} = this.props;

		// TODO: configuration.
		const devModeShowAll = false;

		return (
			<section>
				<textBase.p>
					{translateSync("frontend_supportDescription", [
						translateSync("extensionShortName"),
					])}
				</textBase.p>

				<listBase.ul>
					<listBase.li>
						<textBase.a href={configure("urls.support-feedback")}>
							{translateSync("frontend_supportAndFeedback")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a href={configure("urls.project")}>
							{translateSync("frontend_aboutProjectPageLinkText")}
						</textBase.a>
					</listBase.li>
				</listBase.ul>

				<textBase.h2>
					{translateSync("frontend_faqHeading")}
				</textBase.h2>

				<textBase.h3>
					{translateSync("frontend_faqVoicesHeading")}
				</textBase.h3>

				{this.standardFaqEntry(1)}

				<Discretional
					enabled={devModeShowAll || osType === "win"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translateSync("frontend_faq002Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translateSync("frontend_faq002A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3"
									lang="en"
								>
									Windows 10
								</textBase.a>
								: Settings &gt;&nbsp;Time&nbsp;&amp;&nbsp;Language &gt;&nbsp;Language
								{/* TODO: translate system settings path. */}
							</listBase.li>
							<listBase.li>
								<textBase.a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-4c83a8d8-7486-42f7-8e46-2b0fdf753130"
									lang="en"
								>
									Windows 8
								</textBase.a>
							</listBase.li>
							<listBase.li>
								<textBase.a
									href="https://www.microsoft.com/en-us/download/details.aspx?id=27224"
									lang="en"
								>
									Windows 7
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={devModeShowAll || osType === "cros"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translateSync("frontend_faq003Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translateSync("frontend_faq003A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://chrome.google.com/webstore/detail/us-english-female-text-to/pkidpnnapnfgjhfhkpmjpbckkbaodldb"
									lang="en"
								>
									US English Female Text-to-speech (by Google)
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={devModeShowAll || osType === "mac"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translateSync("frontend_faq004Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translateSync("frontend_faq004A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://support.apple.com/kb/index?page=search&amp;q=VoiceOver+language&amp;product=PF6&amp;doctype=PRODUCT_HELP,HOWTO_ARTICLES&amp;locale=en_US"
									lang="en"
								>
									macOS
								</textBase.a>
								: System&nbsp;Preferences &gt;&nbsp;Accessibility &gt;&nbsp;Speech &gt;&nbsp;System&nbsp;voice &gt;&nbsp;Customize...
								{/* TODO: translate system settings path. */}
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={devModeShowAll || osType === "linux"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translateSync("frontend_faq005Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translateSync("frontend_faq005A")}
						</textBase.p>
					</layoutBase.details>
				</Discretional>

				{this.standardFaqEntry(6)}
				{this.standardFaqEntry(7)}
				{this.standardFaqEntry(8)}
				{this.standardFaqEntry(9)}

				<textBase.h3>
					{translateSync("frontend_faqGeneralHeading")}
				</textBase.h3>

				{this.standardFaqEntry(14)}
				{this.standardFaqEntry(15)}
				{this.standardFaqEntry(16)}

				{/* NOTE: can't change shortcut keys in Firefox */}
				<Discretional
					enabled={devModeShowAll || systemType === "chrome"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translateSync("frontend_faq017Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						<textBase.p>
							{translateSync("frontend_faq017A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href={configure("urls.shortcut-keys")}
									onClick={this.handleOpenShortKeysConfigurationClick}
								>
									{translateSync("frontend_usageShortcutKeyAlternative04")}
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				{/* NOTE: can't change shortcut keys in Firefox */}
				<Discretional
					enabled={devModeShowAll || systemType === "webextension"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translateSync("frontend_faq018Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						<textBase.p>
							{translateSync("frontend_faq018A")}
						</textBase.p>
					</layoutBase.details>
				</Discretional>

				{this.standardFaqEntry(19)}
				{this.standardFaqEntry(20)}
				{this.standardFaqEntry(25)}

				<textBase.h3>
					{translateSync("frontend_faqTalkiePremiumHeading")}
				</textBase.h3>

				{this.standardFaqEntry(21)}
				{this.standardFaqEntry(33)}
				{this.standardFaqEntry(24)}
				{this.standardFaqEntry(22)}
				{this.standardFaqEntry(23)}
				{this.standardFaqEntry(26)}
				{this.standardFaqEntry(27)}
				{this.standardFaqEntry(28)}
				{this.standardFaqEntry(29)}
				{this.standardFaqEntry(30)}
				{this.standardFaqEntry(31)}
				{this.standardFaqEntry(32)}

				<textBase.h3>
					{translateSync("frontend_faqBugsHeading")}
				</textBase.h3>

				{this.standardFaqEntry(10)}
				{this.standardFaqEntry(11)}
				{this.standardFaqEntry(12)}
				{this.standardFaqEntry(13)}
			</section>
		);
	}

	static defaultProps = {
		osType: null,
	};

	private readonly styled: {
		summaryHeading: StyletronComponent<ComponentProps<typeof textBase.h4>>;
	};
}

export default configureAttribute<SupportProps & ConfigureProps>()(
	translateAttribute<SupportProps & ConfigureProps & TranslateProps>()(
		Support,
	),
);

