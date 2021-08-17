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

import Discretional from "@talkie/shared-application/components/discretional";
import TalkieFreeIcon from "@talkie/shared-application/components/icon/talkie-free-icon";
import TalkiePremiumIcon from "@talkie/shared-application/components/icon/talkie-premium-icon";
import FreeSection from "@talkie/shared-application/components/section/free-section";
import PremiumSection from "@talkie/shared-application/components/section/premium-section";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as listBase from "@talkie/shared-application/styled/list/list-base";
import * as textBase from "@talkie/shared-application/styled/text/text-base";
import {
	SystemType,
} from "@talkie/split-environment-interfaces/moved-here/imetadata-manager";
import React, {
	ComponentProps,
} from "react";
import {
	styled,
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

export interface FeaturesProps {
	isPremiumEdition: boolean;
	systemType: SystemType | null;
}

class Features<P extends FeaturesProps & TranslateProps & ConfigureProps> extends React.PureComponent<P> {
	private readonly styled: {
		storeLink: StyletronComponent<ComponentProps<"div">>;
		storeLinks: StyletronComponent<ComponentProps<"div">>;
		storeLinksP: StyletronComponent<ComponentProps<typeof textBase.p>>;
		storeLinksPFirst: StyletronComponent<ComponentProps<typeof textBase.p>>;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			storeLink: styled(
				"div",
				{
					marginTop: "0.5em",
					textAlign: "center",
				},
			),

			storeLinks: styled(
				"div",
				{
					"@media (min-width: 450px)": {
						columns: 2,
					},
					marginTop: "0.5em",
					textAlign: "center",
				},
			),

			storeLinksP: withStyleDeep(
				textBase.p,
				{
					marginBottom: "0.5em",
				},
			),

			storeLinksPFirst: withStyleDeep(
				textBase.p,
				{
					"@media (min-width: 450px)": {
						marginTop: 0,
					},
					marginBottom: "0.5em",
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			systemType,
			translateSync,
			configure,
		} = this.props;

		return (
			<section>
				<p>
					{translateSync("frontend_featuresEditions")}
				</p>

				<Discretional
					enabled={!isPremiumEdition}
				>
					<p>
						{translateSync("frontend_featuresEdition_Free")}
					</p>
				</Discretional>

				<Discretional
					enabled={isPremiumEdition}
				>
					<p>
						{translateSync("frontend_featuresEdition_Premium")}
					</p>
				</Discretional>

				<PremiumSection
					mode="h2"
				>
					<listBase.ul>
						<listBase.li>
							{translateSync("frontend_featuresPremium_List01")}
						</listBase.li>
						<listBase.li>
							{translateSync("frontend_featuresPremium_List02")}
						</listBase.li>

						{/* NOTE: read from clipboard feature not available in Firefox */}
						<Discretional
							enabled={systemType === "chrome"}
						>
							<listBase.li>
								{translateSync("frontend_featuresPremium_List05")}
							</listBase.li>
						</Discretional>

						<listBase.li>
							{translateSync("frontend_featuresPremium_List03")}
						</listBase.li>
						<listBase.li>
							{translateSync("frontend_featuresPremium_List04")}
						</listBase.li>
					</listBase.ul>

					<this.styled.storeLink>
						<textBase.a
							href={configure("urls.options-upgrade-from-demo")}
							lang="en"
						>
							<TalkiePremiumIcon
								mode="inline"
							/>
							{translateSync("frontend_featuresUpgradeToTalkiePremiumLinkText")}
						</textBase.a>
					</this.styled.storeLink>
				</PremiumSection>

				<FreeSection
					mode="h2"
				>
					<listBase.ul>
						<listBase.li>
							{translateSync("frontend_featuresFree_List01")}
						</listBase.li>
						<listBase.li>
							{translateSync("frontend_featuresFree_List02")}
						</listBase.li>
						<listBase.li>
							{translateSync("frontend_featuresFree_List03")}
						</listBase.li>
						<listBase.li>
							{translateSync("frontend_featuresFree_List04")}
						</listBase.li>
						<listBase.li>
							{translateSync("frontend_featuresFree_List05")}
						</listBase.li>
						<listBase.li>
							{translateSync("frontend_featuresFree_List06")}
						</listBase.li>
					</listBase.ul>

					<this.styled.storeLinks>
						<this.styled.storeLinksPFirst>
							<textBase.a
								href={configure("urls.chromewebstore")}
								lang="en"
							>
								<img alt="Talkie is available for installation from the Chrome Web Store" height="75" src="../../../shared-resources/src/resources/chrome-web-store/ChromeWebStore_Badge_v2_496x150.png" width="248"/>
								<br/>
								<TalkieFreeIcon
									mode="inline"
								/>
								{translateSync("extensionShortName_Free")}
							</textBase.a>
						</this.styled.storeLinksPFirst>
						<this.styled.storeLinksP>
							<textBase.a
								href={configure("urls.firefox-amo")}
								lang="en"
							>
								<img alt="Talkie is available for installation from the Chrome Web Store" height="60" src="../../../shared-resources/src/resources/firefox-amo/AMO-button_1.png" width="172"/>
								<br/>
								<TalkieFreeIcon
									mode="inline"
								/>
								{translateSync("extensionShortName_Free")}
							</textBase.a>
						</this.styled.storeLinksP>
					</this.styled.storeLinks>
				</FreeSection>
			</section>
		);
	}
}

export default configureAttribute<FeaturesProps & ConfigureProps>()(
	translateAttribute<FeaturesProps & TranslateProps & ConfigureProps>()(
		Features,
	),
);
