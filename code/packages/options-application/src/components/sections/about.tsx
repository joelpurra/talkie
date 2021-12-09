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

import SharingIcons from "@talkie/shared-application/components/sharing/sharing-icons.js";
import TalkieEditionIcon from "@talkie/shared-application/components/icon/talkie-edition-icon.js";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate.js";
import * as listBase from "@talkie/shared-application/styled/list/list-base.js";
import * as textBase from "@talkie/shared-application/styled/text/text-base.js";
import {
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import {
	OsType,
	SystemType,
} from "@talkie/split-environment-interfaces/moved-here/imetadata-manager.mjs";
import React, { ComponentProps } from "react";
import { StyletronComponent, styled } from "styletron-react";

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
	voiceNames: string[];
}

class About<P extends AboutProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		navigatorLanguage: null,
		osType: null,
	};

	private readonly styled: {
		sharingIcons: StyletronComponent<ComponentProps<typeof SharingIcons>>;
	};

	constructor(props: P) {
		super(props);

		this.handleLegaleseClick = this.handleLegaleseClick.bind(this);

		this.styled = {
			sharingIcons: styled(
				SharingIcons,
				{
					display: "inline-block",
					verticalAlign: "middle",
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
			voiceNames,
		} = this.props as AboutProps & ConfigureProps & TranslateProps;

		// TODO: move resolving the name to the state, like edition type?
		const extensionShortName = isPremiumEdition
			? translateSync("extensionShortName_Premium")
			: translateSync("extensionShortName_Free");

		return (
			<section>
				<textBase.h2>
					{translateSync("frontend_storyHeading")}
				</textBase.h2>
				<textBase.p>
					{translateSync("frontend_storyDescription")}
				</textBase.p>
				<textBase.p>
					{translateSync("frontend_storyThankYou")}
				</textBase.p>
				<textBase.p>
					—
					<textBase.a
						href="https://joelpurra.com/"
						lang="sv"
					>
						Joel Purra
					</textBase.a>
				</textBase.p>

				<textBase.h2>
					{translateSync("frontend_shareHeading")}
				</textBase.h2>

				<textBase.p>
					{translateSync("frontend_sharePitch", [
						translateSync("extensionShortName"),
					])}
				</textBase.p>

				<div>
					<this.styled.sharingIcons/>

					<textBase.a href={configure("urls.rate")}>
						{translateSync("frontend_rateIt")}
					</textBase.a>
				</div>

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
						{sortedNavigatorLanguages.length}
						)
					</listBase.dt>
					<listBase.dd
						lang="en"
					>
						{sortedNavigatorLanguages.join(", ")}
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
						{sortedLanguageGroups.join(", ")}
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
						{sortedTranslatedLanguages.length}
						)
					</listBase.dt>
					<listBase.dd
						lang="en"
					>
						{sortedTranslatedLanguages.join(", ")}
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
					<listBase.li>
						<textBase.a href={configure("urls.github")}>
							{translateSync("frontend_aboutCodeOnGithubLinkText")}
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
