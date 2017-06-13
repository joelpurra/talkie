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

import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";
import * as buttonBase from "../../../shared/styled/button/button-base.jsx";

import Discretional from "../../../shared/components/discretional.jsx";
import TalkieVersionIcon from "../../../shared/components/icon/talkie-version-icon.jsx";

@configureAttribute
@translateAttribute
export default class Header extends React.Component {
    constructor(props) {
        super(props);

        this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);

        this.styled = {
            iconWrapper: styled({
                verticalAlign: "middle",
            })(textBase.span),

            extensionName: styled({
                fontWeight: "bold",
                textDecoration: "none",
                color: "#000000",
                ":focus": {
                    outline: 0,
                },
            })(textBase.a),

            button: styled({
                lineHeight: "1.5em",
                // float: __MSG_@@bidi_end_edge__;
            })(buttonBase.a),
        };
    }

    static defaultProps={
        isPremiumVersion: false,
    }

    static propTypes = {
        playPauseClick: PropTypes.func.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    handlePlayPauseClick(e) {
        e.preventDefault();

        this.props.playPauseClick();

        return false;
    }

    render() {
        const {
            isPremiumVersion,
            configure,
            translate,
        } = this.props;

        return (
            <layoutBase.header>
                <p>
                    <this.styled.iconWrapper
                        onClick={this.handlePlayPauseClick}
                    >
                        <TalkieVersionIcon
                            isPremiumVersion={isPremiumVersion}
                        />
                    </this.styled.iconWrapper>

                    <this.styled.extensionName href={configure("urls.main")}>
                        {translate("extensionShortName")}
                    </this.styled.extensionName>

                    <Discretional
                        enabled={isPremiumVersion}
                    >
                        <this.styled.button href={configure("urls.store-premium")} id="header-premium-button">
                            {translate("extensionShortName_Premium")}
                        </this.styled.button>
                    </Discretional>
                </p>
            </layoutBase.header>
        );
    }
}
