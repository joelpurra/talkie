/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

import React from "react";
import PropTypes from "prop-types";

import configureAttribute from "../../../shared/hocs/configure.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import styled from "../../../shared/hocs/styled.jsx";

import * as textBase from "../../../shared/styled/text/text-base.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";

import Discretional from "../../../shared/components/discretional.jsx";
import FreeSection from "../../../shared/components/section/free-section.jsx";
import PremiumSection from "../../../shared/components/section/premium-section.jsx";
import TalkieFreeIcon from "../../../shared/components/icon/talkie-free-icon.jsx";
import TalkiePremiumIcon from "../../../shared/components/icon/talkie-premium-icon.jsx";

@configureAttribute
@translateAttribute
export default class Features extends React.Component {
    constructor(props) {
        super(props);

        this.styled = {
            storeLinks: styled({
                textAlign: "center",
                marginTop: "0.5em",
                "@media (min-width: 450px)": {
                    columns: 2,
                },
            })("div"),

            storeLinksP: styled({
                marginBottom: "0.5em",
            })(textBase.p),

            storeLinksPFirst: styled({
                marginBottom: "0.5em",
                "@media (min-width: 450px)": {
                    marginTop: 0,
                },
            })(textBase.p),
        };
    }

    static defaultProps = {
        isPremiumVersion: false,
        systemType: false,
    };

    static propTypes = {
        isPremiumVersion: PropTypes.bool.isRequired,
        systemType: PropTypes.string.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    render() {
        const {
            isPremiumVersion,
            systemType,
        } = this.props;

        return (
            <section>
                <p>
                    {this.props.translate("frontend_featuresVersions")}
                </p>

                <Discretional
                    enabled={!isPremiumVersion}
                >
                    <p>{this.props.translate("frontend_featuresVersion_Free")}</p>
                </Discretional>

                <Discretional
                    enabled={isPremiumVersion}
                >
                    <p>{this.props.translate("frontend_featuresVersion_Premium")}</p>
                </Discretional>

                <PremiumSection>
                    <listBase.ul>
                        <listBase.li>{this.props.translate("frontend_featuresPremium_List01")}</listBase.li>
                        <listBase.li>{this.props.translate("frontend_featuresPremium_List02")}</listBase.li>

                        {/* NOTE: read from clipboard feature not available in Firefox */}
                        <Discretional
                            enabled={systemType === "chrome"}
                        >
                            <listBase.li>{this.props.translate("frontend_featuresPremium_List05")}</listBase.li>
                        </Discretional>

                        <listBase.li>{this.props.translate("frontend_featuresPremium_List03")}</listBase.li>
                        <listBase.li>{this.props.translate("frontend_featuresPremium_List04")}</listBase.li>
                    </listBase.ul>

                    <this.styled.storeLinks>
                        <this.styled.storeLinksPFirst>
                            <textBase.a href={this.props.configure("urls.chromewebstore-premium")}>
                                <img src="../../resources/chrome-web-store/ChromeWebStore_Badge_v2_206x58.png" alt="Talkie Premium is available for installation from the Chrome Web Store" width="206" height="58" />
                                <br />
                                <TalkiePremiumIcon />
                                    Talkie Premium
                                </textBase.a>
                        </this.styled.storeLinksPFirst>
                        <this.styled.storeLinksP>
                            <textBase.a href={this.props.configure("urls.firefox-amo-premium")}>
                                <img src="../../resources/firefox-amo/AMO-button_1.png" alt="Talkie is available for installation from the Chrome Web Store" width="172" height="60" />
                                <br />
                                <TalkiePremiumIcon />
                                    Talkie Premium
                                </textBase.a>
                        </this.styled.storeLinksP>
                    </this.styled.storeLinks>
                </PremiumSection>

                <FreeSection>
                    <listBase.ul>
                        <listBase.li>{this.props.translate("frontend_featuresFree_List01")}</listBase.li>
                        <listBase.li>{this.props.translate("frontend_featuresFree_List02")}</listBase.li>
                        <listBase.li>{this.props.translate("frontend_featuresFree_List03")}</listBase.li>
                        <listBase.li>{this.props.translate("frontend_featuresFree_List04")}</listBase.li>
                        <listBase.li>{this.props.translate("frontend_featuresFree_List05")}</listBase.li>
                        <listBase.li>{this.props.translate("frontend_featuresFree_List06")}</listBase.li>
                    </listBase.ul>

                    <this.styled.storeLinks>
                        <this.styled.storeLinksPFirst>
                            <textBase.a href={this.props.configure("urls.chromewebstore-free")}>
                                <img src="../../resources/chrome-web-store/ChromeWebStore_Badge_v2_206x58.png" alt="Talkie is available for installation from the Chrome Web Store" width="206" height="58" />
                                <br />
                                <TalkieFreeIcon />
                                    Talkie
                                </textBase.a>
                        </this.styled.storeLinksPFirst>
                        <this.styled.storeLinksP>
                            <textBase.a href={this.props.configure("urls.firefox-amo-free")}>
                                <img src="../../resources/firefox-amo/AMO-button_1.png" alt="Talkie is available for installation from the Chrome Web Store" width="172" height="60" />
                                <br />
                                <TalkieFreeIcon />
                                    Talkie
                                </textBase.a>
                        </this.styled.storeLinksP>
                    </this.styled.storeLinks>
                </FreeSection>
            </section>
        );
    }
}
