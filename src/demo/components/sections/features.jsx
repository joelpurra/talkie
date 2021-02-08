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

import PropTypes from "prop-types";
import React from "react";

import Discretional from "../../../shared/components/discretional.jsx";
import TalkieFreeIcon from "../../../shared/components/icon/talkie-free-icon.jsx";
import TalkiePremiumIcon from "../../../shared/components/icon/talkie-premium-icon.jsx";
import FreeSection from "../../../shared/components/section/free-section.jsx";
import PremiumSection from "../../../shared/components/section/premium-section.jsx";
import configureAttribute from "../../../shared/hocs/configure.jsx";
import styled from "../../../shared/hocs/styled.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";

export default
@configureAttribute
@translateAttribute
class Features extends React.PureComponent {
	constructor(props) {
		super(props);

		this.styled = {
			storeLink: styled({
				marginTop: "0.5em",
				textAlign: "center",
			})("div"),

			storeLinks: styled({
				"@media (min-width: 450px)": {
					columns: 2,
				},
				marginTop: "0.5em",
				textAlign: "center",
			})("div"),

			storeLinksP: styled({
				marginBottom: "0.5em",
			})(textBase.p),

			storeLinksPFirst: styled({
				"@media (min-width: 450px)": {
					marginTop: 0,
				},
				marginBottom: "0.5em",
			})(textBase.p),
		};
	}

	static propTypes = {
		configure: PropTypes.func.isRequired,
		isPremiumEdition: PropTypes.bool.isRequired,
		onConfigurationChange: PropTypes.func.isRequired,
		systemType: PropTypes.string.isRequired,
		translate: PropTypes.func.isRequired,
	}

	componentDidMount() {
		this._unregisterConfigurationListener = this.props.onConfigurationChange(() => this.forceUpdate());
	}

	componentWillUnmount() {
		this._unregisterConfigurationListener();
	}

	render() {
		const {
			isPremiumEdition,
			systemType,
			translate,
			configure,
		} = this.props;

		return (
			<section>
				<p>
					{translate("frontend_featuresEditions")}
				</p>

				<Discretional
					enabled={!isPremiumEdition}
				>
					<p>
						{translate("frontend_featuresEdition_Free")}
					</p>
				</Discretional>

				<Discretional
					enabled={isPremiumEdition}
				>
					<p>
						{translate("frontend_featuresEdition_Premium")}
					</p>
				</Discretional>

				<PremiumSection>
					<listBase.ul>
						<listBase.li>
							{translate("frontend_featuresPremium_List01")}
						</listBase.li>
						<listBase.li>
							{translate("frontend_featuresPremium_List02")}
						</listBase.li>

						{/* NOTE: read from clipboard feature not available in Firefox */}
						<Discretional
							enabled={systemType === "chrome"}
						>
							<listBase.li>
								{translate("frontend_featuresPremium_List05")}
							</listBase.li>
						</Discretional>

						<listBase.li>
							{translate("frontend_featuresPremium_List03")}
						</listBase.li>
						<listBase.li>
							{translate("frontend_featuresPremium_List04")}
						</listBase.li>
					</listBase.ul>

					<this.styled.storeLink>
						<textBase.a
							href={configure("urls.options-upgrade-from-demo")}
							lang="en"
						>
							<TalkiePremiumIcon/>
							{translate("frontend_featuresUpgradeToTalkiePremiumLinkText")}
						</textBase.a>
					</this.styled.storeLink>
				</PremiumSection>

				<FreeSection>
					<listBase.ul>
						<listBase.li>
							{translate("frontend_featuresFree_List01")}
						</listBase.li>
						<listBase.li>
							{translate("frontend_featuresFree_List02")}
						</listBase.li>
						<listBase.li>
							{translate("frontend_featuresFree_List03")}
						</listBase.li>
						<listBase.li>
							{translate("frontend_featuresFree_List04")}
						</listBase.li>
						<listBase.li>
							{translate("frontend_featuresFree_List05")}
						</listBase.li>
						<listBase.li>
							{translate("frontend_featuresFree_List06")}
						</listBase.li>
					</listBase.ul>

					<this.styled.storeLinks>
						<this.styled.storeLinksPFirst>
							<textBase.a
								href={configure("urls.chromewebstore")}
								lang="en"
							>
								<img alt="Talkie is available for installation from the Chrome Web Store" height="75" src="../../resources/chrome-web-store/ChromeWebStore_Badge_v2_496x150.png" width="248"/>
								<br/>
								<TalkieFreeIcon/>
								{translate("extensionShortName_Free")}
							</textBase.a>
						</this.styled.storeLinksPFirst>
						<this.styled.storeLinksP>
							<textBase.a
								href={configure("urls.firefox-amo")}
								lang="en"
							>
								<img alt="Talkie is available for installation from the Chrome Web Store" height="60" src="../../resources/firefox-amo/AMO-button_1.png" width="172"/>
								<br/>
								<TalkieFreeIcon/>
								{translate("extensionShortName_Free")}
							</textBase.a>
						</this.styled.storeLinksP>
					</this.styled.storeLinks>
				</FreeSection>
			</section>
		);
	}
}
