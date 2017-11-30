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
import styled from "../../../shared/hocs/styled.jsx";

import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as lighter from "../../../shared/styled/text/lighter.jsx";

import Icon from "../../../shared/components/icon/icon.jsx";

@configureAttribute
export default class Footer extends React.Component {
    constructor(props) {
        super(props);

        this.styled = {
            footer: styled({
                lineHeight: "2em",
                verticalAlign: "middle",
            })(layoutBase.footer),

            footerFirstLink: styled({
                fontSize: "1.75em",
            })(lighter.a),

            footerSecondLink: styled({
                // float: __MSG_@@bidi_end_edge__;
            })(lighter.a),
        };
    }

    static defaultProps = {
        versionNumber: false,
    };

    static propTypes = {
        versionNumber: PropTypes.string.isRequired,
        optionsPageClick: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    render() {
        const {
            configure,
            versionNumber,
            optionsPageClick,
        } = this.props;

        return (
            <this.styled.footer>
                <this.styled.footerFirstLink
                    href={configure("urls.options")}
                    rel="noopener noreferrer"
                    target="_blank"
                    onClick={optionsPageClick}
                >
                    <Icon mode="standalone" size="0.75em" className="icon-settings" />
                </this.styled.footerFirstLink>

                <this.styled.footerSecondLink href={configure("urls.options-about-from-popup")} id="footer-about-link">
                    v{versionNumber}
                </this.styled.footerSecondLink>
            </this.styled.footer>
        );
    }
}
