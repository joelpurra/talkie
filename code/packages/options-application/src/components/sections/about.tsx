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

import TalkieEditionIcon from "@talkie/shared-application/components/icon/talkie-edition-icon";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as listBase from "@talkie/shared-application/styled/list/list-base";
import * as textBase from "@talkie/shared-application/styled/text/text-base";
import {
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider";
import {
	OsType,
	SystemType,
} from "@talkie/split-environment-interfaces/moved-here/imetadata-manager";
import React from "react";

export interface AboutStateProps {
	isPremiumEdition: boolean;
	languageGroups: readonly string[];
	languages: readonly string[];
	navigatorLanguage?: string | null;
	navigatorLanguages: readonly string[];
	osType?: OsType | null;
	systemType: SystemType | null;
	translatedLanguages: Readonly<TalkieLocale[]>;
	versionName: string | null;
}

interface AboutProps extends AboutStateProps {
	onLicenseClick: (legaleseText: string) => void;
	voiceNames: string[];
}

class About<P extends AboutProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		navigatorLanguage: null,
		osType: null,
	};

	constructor(props: P) {
		super(props);

		this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
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

	override render(): React.ReactNode {
		const {
			configure,
			isPremiumEdition,
			languageGroups,
			languages,
			navigatorLanguage,
			navigatorLanguages,
			osType,
			systemType,
			translatedLanguages,
			translateSync,
			versionName,
			voiceNames,
		} = this.props as AboutProps & ConfigureProps & TranslateProps;

		// TODO: move resolving the name to the state, like edition type?
		const extensionShortName = isPremiumEdition
			? translateSync("extensionShortName_Premium")
			: translateSync("extensionShortName_Free");

		return (
			<section>
				<listBase.ul>
					<listBase.li>
						<textBase.a href={configure("urls.support-feedback")}>
							{translateSync("frontend_supportAndFeedback")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a href={configure("urls.rate")}>
							{translateSync("frontend_rateIt")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a href={configure("urls.project")}>
							{translateSync("frontend_aboutProjectPageLinkText")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a href={configure("urls.github")}>
							{translateSync("frontend_aboutCodeOnGithubLinkText")}
						</textBase.a>
					</listBase.li>
				</listBase.ul>

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
						{navigatorLanguage}
					</listBase.dd>

					<listBase.dt>
						{translateSync("frontend_systemBrowserLanguagesHeading")}
						{" "}
						(
						{navigatorLanguages.length}
						)
					</listBase.dt>
					<listBase.dd
						lang="en"
					>
						{navigatorLanguages.join(", ")}
					</listBase.dd>

					<listBase.dt>
						{translateSync("frontend_systemInstalledLanguagesHeading")}
						{" "}
						(
						{languageGroups.length}
						)
					</listBase.dt>
					<listBase.dd
						lang="en"
					>
						{languageGroups.join(", ")}
					</listBase.dd>

					<listBase.dt>
						{translateSync("frontend_systemInstalledDialectsHeading")}
						{" "}
						(
						{languages.length}
						)
					</listBase.dt>
					<listBase.dd
						lang="en"
					>
						{languages.join(", ")}
					</listBase.dd>

					<listBase.dt>
						{translateSync("frontend_systemInstalledVoicesHeading")}
						{" "}
						(
						{voiceNames.length}
						)
					</listBase.dt>
					<listBase.dd>
						{voiceNames.join(", ")}
					</listBase.dd>

					<listBase.dt>
						{translateSync("frontend_systemTalkieUILanguageHeading")}
					</listBase.dt>
					<listBase.dd
						lang="en"
					>
						{translateSync("extensionLocale")}
					</listBase.dd>

					<listBase.dt>
						{translateSync("frontend_systemTalkieUILanguagesHeading")}
						{" "}
						(
						{translatedLanguages.length}
						)
					</listBase.dt>
					<listBase.dd
						lang="en"
					>
						{translatedLanguages.join(", ")}
					</listBase.dd>
				</listBase.dl>

				<textBase.h2>
					{translateSync("frontend_licenseHeading")}
				</textBase.h2>
				<p
					lang="en"
					onClick={this.handleLegaleseClick}
				>
					{translateSync("frontend_licenseGPLDescription")}
				</p>
				<p>
					{translateSync("frontend_licenseCLADescription")}
				</p>
				<listBase.ul>
					<listBase.li>
						<textBase.a
							href={configure("urls.gpl")}
							lang="en"
						>
							{translateSync("frontend_licenseGPLLinkText")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a
							href={configure("urls.cla")}
							lang="en"
						>
							{translateSync("frontend_licenseCLALinkText")}
						</textBase.a>
					</listBase.li>
				</listBase.ul>
			</section>
		);
	}
}

export default configureAttribute<AboutProps & ConfigureProps>()(
	translateAttribute<AboutProps & ConfigureProps & TranslateProps>()(
		About,
	),
);
