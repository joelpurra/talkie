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
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import TalkieFreeIcon from "@talkie/shared-ui/components/icon/talkie-free-icon.js";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React, {
	ComponentProps,
} from "react";
import type {
	StyletronComponent,
} from "styletron-react";
import {
	styled,
} from "styletron-react";

import FreeSection from "../../components/section/free-section.js";
import PremiumSection from "../../components/section/premium-section.js";
import {
	actions,
} from "../../slices/index.mjs";
import TalkiePremiumEdition from "./features/talkie-premium-edition.js";

export interface FeaturesStateProps {
	isPremiumEdition: boolean;
	systemType: SystemType | null;
}

export interface FeaturesDispatchProps {
	storeIsPremiumEdition: typeof actions.shared.metadata.storeIsPremiumEdition;
}

interface FeaturesProps extends FeaturesStateProps, FeaturesDispatchProps {}

class Features<P extends FeaturesProps & TranslateProps & ConfigureProps> extends React.PureComponent<P> {
	private readonly styled: {
		storeLink: StyletronComponent<ComponentProps<"div">>;
		storeLinks: StyletronComponent<ComponentProps<"div">>;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			storeLink: styled(
				"div",
				{
					marginBottom: "2em",
					marginLeft: "2em",
					marginRight: "2em",
					marginTop: "2em",
					textAlign: "center",
				},
			),

			storeLinks: styled(
				"div",
				{
					"@media (min-width: 500px)": {
						"align-items": "flex-end",
						display: "flex",
						"justify-content": "space-evenly",
					},
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			storeIsPremiumEdition,
			systemType,
			translateSync,
			configure,
		} = this.props;

		const cwsAltText = "Talkie is available for installation from the Chrome Web Store";
		const amoAltText = "Talkie is available for installation from Mozilla Addons";

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

				<FreeSection
					headingLink={false}
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
						<this.styled.storeLink>
							<textBase.a
								href={configure("urls.external.chromewebstore")}
								lang="en"
							>
								<img alt={cwsAltText} height="75" src="../../../shared-resources/src/resources/chrome-web-store/ChromeWebStore_Badge_v2_496x150.png" width="248"/>
								<br/>
								<TalkieFreeIcon
									mode="inline"
								/>
								{translateSync("extensionShortName_Free")}
							</textBase.a>
						</this.styled.storeLink>
						<this.styled.storeLink>
							<textBase.a
								href={configure("urls.external.firefox-amo")}
								lang="en"
							>
								<img alt={amoAltText} height="60" src="../../../shared-resources/src/resources/firefox-amo/AMO-button_1.png" width="172"/>
								<br/>
								<TalkieFreeIcon
									mode="inline"
								/>
								{translateSync("extensionShortName_Free")}
							</textBase.a>
						</this.styled.storeLink>
					</this.styled.storeLinks>
				</FreeSection>

				<PremiumSection
					headingLink={false}
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
				</PremiumSection>

				<TalkiePremiumEdition
					disabled={false}
					isPremiumEdition={isPremiumEdition}
					onChange={storeIsPremiumEdition}
				/>
			</section>
		);
	}
}

export default configureAttribute<FeaturesProps & ConfigureProps>()(
	translateAttribute<FeaturesProps & TranslateProps & ConfigureProps>()(
		Features,
	),
);
