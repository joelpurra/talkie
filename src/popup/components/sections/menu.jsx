/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019 Joel Purra <https://joelpurra.com/>

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

import Icon from "../../../shared/components/icon/icon.jsx";

export default
@configureAttribute
@translateAttribute
class Menu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.styled = {
            ol: styled({
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                listStyle: "none",
            })("ol"),

            li: styled({
                display: "block",
                marginTop: "0.25em",
                marginBottom: "0.25em",
                verticalAlign: "middle",
            })("li"),

            a: styled({
                display: "block",
                height: "2em",
                lineHeight: "2em",
                textDecoration: "none",
                borderRadius: "0.3em",
            })(textBase.a),
        };
    }

    static propTypes = {
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    render() {
        const {
            configure,
            translate,
        } = this.props;

        return (
            <layoutBase.nav>
                <this.styled.ol>
                    <this.styled.li>
                        <this.styled.a href={configure("urls.demo-voices")} rel="noopener noreferrer" target="_blank">
                            <Icon className="icon-voices" />
                            {translate("frontend_PopupMenu_Voices")}
                        </this.styled.a>
                    </this.styled.li>
                    <this.styled.li>
                        <this.styled.a href={configure("urls.demo-usage")} rel="noopener noreferrer" target="_blank">
                            <Icon className="icon-usage" />
                            {translate("frontend_PopupMenu_Usage")}
                        </this.styled.a>
                    </this.styled.li>
                    <this.styled.li>
                        <this.styled.a href={configure("urls.demo-features")} rel="noopener noreferrer" target="_blank">
                            <Icon className="icon-features" />
                            {translate("frontend_PopupMenu_Features")}
                        </this.styled.a>
                    </this.styled.li>
                    <this.styled.li>
                        <this.styled.a href={configure("urls.demo-support")} rel="noopener noreferrer" target="_blank">
                            <Icon className="icon-feedback" />
                            {translate("frontend_supportAndFeedback")}
                        </this.styled.a>
                    </this.styled.li>
                </this.styled.ol>
            </layoutBase.nav>
        );
    }
}
