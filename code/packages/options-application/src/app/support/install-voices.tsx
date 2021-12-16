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

import Discretional from "@talkie/shared-ui/components/discretional.js";
import Loading from "../../components/loading.js";
import Markdown from "../../components/markdown.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	OsType,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import React, {
	ComponentProps,
} from "react";
import {
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

export interface InstallVoicesProps {
	haveVoices: boolean;
	languageGroupsCount: number;
	languagesCount: number;
	osType?: OsType | null;
	systemType: SystemType | null;
	voicesCount: number;
}

class InstallVoices<P extends InstallVoicesProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		osType: null,
		sampleText: null,
		sampleTextLanguageCode: null,
	};

	private readonly styled: {
		summaryHeading: StyletronComponent<ComponentProps<typeof textBase.h3>>;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			summaryHeading: withStyleDeep(
				textBase.h3,
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

	override render(): React.ReactNode {
		const {
			haveVoices,
			languageGroupsCount,
			languagesCount,
			osType,
			systemType,
			translateSync,
			voicesCount,
		} = this.props;

		// TODO: configuration.
		const devModeShowAll = false;

		// TODO: translated, pretty name.
		const systemTypePrettyName = systemType ?? "(unknown system type)";

		// TODO: translated, pretty name.
		const osTypePrettyName = osType ?? "(unknown operating system)";

		const boldedVoicesCountMarkdown = `**${voicesCount.toString(10)}**`;
		const boldedLanguageGroupsCountMarkdown = `**${languageGroupsCount.toString(10)}**`;
		const boldedLanguagesCountMarkdown = `**${languagesCount.toString(10)}**`;

		const moreVoicesCountsMarkdown = translateSync("frontend_welcomeInstallMoreVoicesDescription", [
			boldedVoicesCountMarkdown,
			boldedLanguageGroupsCountMarkdown,
			boldedLanguagesCountMarkdown,
			systemTypePrettyName,
			osTypePrettyName,
		]);

		return (
			<section>
				<textBase.p>
					<Loading
						enabled={haveVoices}
					>
						<Markdown>
							{moreVoicesCountsMarkdown}
						</Markdown>
					</Loading>
				</textBase.p>

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
			</section>
		);
	}
}

export default translateAttribute<InstallVoicesProps & TranslateProps>()(
	InstallVoices,
);
