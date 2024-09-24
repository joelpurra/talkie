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
	isLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices.mjs";
import {
	type OsType,
	type SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import TalkieEditionIcon from "@talkie/shared-ui/components/icon/talkie-edition-icon.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import {
	withTalkieStyleDeep,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import React from "react";

export interface AboutStateProps {
	isPremiumEdition: boolean;
	sortedLanguageGroups: readonly string[];
	sortedLanguages: readonly string[];
	navigatorLanguage?: string | null;
	sortedNavigatorLanguages: readonly string[];
	osType?: OsType | null;
	systemType: SystemType | null;
	sortedTranslatedLanguages: Readonly<TalkieLocale[]>;
	versionName: string | null;
}

interface AboutProps extends AboutStateProps {
	onLicenseClick: (legaleseText: string) => void;
	voiceNamesAndLanguages: string[];
}

class About<P extends AboutProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		navigatorLanguage: null,
		osType: null,
	};

	private readonly styled: {
		scrollableDd: TalkieStyletronComponent<typeof listBase.dd>;
	};

	constructor(props: P) {
		super(props);

		this.handleLegaleseClick = this.handleLegaleseClick.bind(this);

		this.styled = {
			scrollableDd: withTalkieStyleDeep(
				listBase.dd,
				{
					maxHeight: "10em",
					overflowY: "scroll",
				},
			),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleLegaleseClick(event: Readonly<React.MouseEvent<HTMLSpanElement>>): void {
		const legaleseText = (event.target as Node).textContent;

		if (!legaleseText) {
			// NOTE: functionality error, ignoring.
			return;
		}

		this.props.onLicenseClick(legaleseText);
	}

	linkLanguageGroupToWikipedia(languageGroup: TalkieLocale | string): React.ReactNode {
		const linkToWikipedia = (
			<a
				href={`https://${languageGroup}.wikipedia.org/`}
			>
				{languageGroup}
			</a>
		);

		// NOTE: some language lists mix groups and dialects; allow dialects but do not link them.
		const textOrLink = isLanguageGroup(languageGroup)
			? linkToWikipedia
			: languageGroup;

		return textOrLink;
	}

	linkLanguageGroupsToWikipedia(languageGroups: ReadonlyArray<TalkieLocale | string>): React.ReactNode {
		return languageGroups.map((languageGroup, index, array) => (
			<React.Fragment
				key={languageGroup}
			>
				{this.linkLanguageGroupToWikipedia(languageGroup)}
				{index < array.length - 1 ? ", " : null}
			</React.Fragment>
		));
	}

	override render(): React.ReactNode {
		const {
			configure,
			isPremiumEdition,
			sortedLanguageGroups,
			sortedLanguages,
			navigatorLanguage,
			sortedNavigatorLanguages,
			osType,
			systemType,
			sortedTranslatedLanguages,
			translateSync,
			versionName,
			voiceNamesAndLanguages,
		} = this.props as AboutProps & ConfigureProps & TranslateProps;

		// TODO: move resolving the name to the state, like edition type?
		const extensionShortName = isPremiumEdition
			? translateSync("extensionShortName_Premium")
			: translateSync("extensionShortName_Free");

		// TODO: generate list during build, load as data?
		const licenseLinkNames = [
			"@talkie/options-application",
			"@talkie/popup-application",
			"react-dom",
			"react-redux",
			"react",
			"redux-toolkit",
		].sort((a, b) => a.localeCompare(b));

		// TODO: list and limit as arguments.
		const ScrollableLongList = voiceNamesAndLanguages.length >= 100
			? this.styled.scrollableDd
			: listBase.dd;

		return (
			<>
				<textBase.h1>
					{translateSync("frontend_aboutLinkText")}
				</textBase.h1>

				<section>
					<textBase.h2>
						{translateSync("frontend_storyHeading")}
					</textBase.h2>
					<p>
						{translateSync("frontend_storyDescription")}
					</p>
					<p>
						{translateSync("frontend_storyThankYou")}
					</p>
					<p>
						—
						{" "}
						<a
							href="https://joelpurra.com/"
							lang="sv"
						>
							Joel Purra
						</a>
					</p>
				</section>

				<section>
					<textBase.h2>
						{translateSync("frontend_systemHeading")}
					</textBase.h2>

					<listBase.dl>
						<listBase.dt>
							{translateSync("frontend_systemCurrentEditionHeading")}
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							<TalkieEditionIcon
								isPremiumEdition={isPremiumEdition}
								mode="inline"
							/>
							{extensionShortName}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemInstalledVersionHeading")}
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{translateSync("extensionShortName")}
							{" "}
							{versionName}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemBrowserTypeHeading")}
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{systemType}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemOSHeading")}
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{osType}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemBrowserLanguageHeading")}
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{navigatorLanguage ? this.linkLanguageGroupToWikipedia(navigatorLanguage) : null}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemBrowserLanguagesHeading")}
							{" "}
							(
							{sortedNavigatorLanguages.length}
							)
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{this.linkLanguageGroupsToWikipedia(sortedNavigatorLanguages)}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemInstalledLanguagesHeading")}
							{" "}
							(
							{sortedLanguageGroups.length}
							)
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{this.linkLanguageGroupsToWikipedia(sortedLanguageGroups)}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemInstalledDialectsHeading")}
							{" "}
							(
							{sortedLanguages.length}
							)
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{sortedLanguages.join(", ")}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemInstalledVoicesHeading")}
							{" "}
							(
							{voiceNamesAndLanguages.length}
							)
						</listBase.dt>
						<ScrollableLongList>
							{voiceNamesAndLanguages.join(", ")}
						</ScrollableLongList>

						<listBase.dt>
							{translateSync("frontend_systemTalkieUILanguageHeading")}
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{this.linkLanguageGroupToWikipedia(translateSync("extensionLocale"))}
						</listBase.dd>

						<listBase.dt>
							{translateSync("frontend_systemTalkieUILanguagesHeading")}
							{" "}
							(
							{sortedTranslatedLanguages.length}
							)
						</listBase.dt>
						<listBase.dd
							lang="en"
						>
							{this.linkLanguageGroupsToWikipedia(sortedTranslatedLanguages)}
						</listBase.dd>
					</listBase.dl>
				</section>

				<section>
					<textBase.h2>
						{translateSync("frontend_licenseHeading")}
					</textBase.h2>
					<p
						lang="en"
						onClick={this.handleLegaleseClick}
					>
						<buttonBase.transparentButton
							type="button"
						>
							{translateSync("frontend_licenseGPLDescription")}
						</buttonBase.transparentButton>
					</p>
					<p>
						{translateSync("frontend_licenseCLADescription")}
					</p>

					<listBase.ul>
						<listBase.li>
							<a
								href={configure("urls.external.gpl")}
								lang="en"
							>
								{translateSync("frontend_licenseGPLLinkText")}
							</a>
						</listBase.li>
						<listBase.li>
							<a
								href={configure("urls.external.cla")}
								lang="en"
							>
								{translateSync("frontend_licenseCLALinkText")}
							</a>
						</listBase.li>
						<listBase.li>
							<a
								href={configure("urls.external.github")}
							>
								{translateSync("frontend_aboutCodeOnGithubLinkText")}
							</a>
						</listBase.li>
					</listBase.ul>

					<layoutBase.details>
						<summary>
							<textBase.summaryHeading3>
								{translateSync("frontend_licenseThirdPartyHeading")}
							</textBase.summaryHeading3>
						</summary>

						<listBase.ul>
							{licenseLinkNames.map((licenseLinkName) => (
								<listBase.li
									key={licenseLinkName}
								>
									<a
										href={configure(`urls.license.${licenseLinkName}`)}
										lang="en"
										rel="noopener noreferrer"
										target="_blank"
									>
										<code>
											{licenseLinkName}
										</code>
									</a>
								</listBase.li>
							))}
						</listBase.ul>
					</layoutBase.details>
				</section>
			</>
		);
	}
}

export default configureAttribute<AboutProps & ConfigureProps>()(
	translateAttribute<AboutProps & ConfigureProps & TranslateProps>()(
		About,
	),
);
