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
import * as tableBase from "../../../shared/styled/table/table-base.jsx";

@configureAttribute
@translateAttribute
export default class Nav extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.styled = {
            backButton: styled({
                textDecoration: "none",
            })(textBase.a),

            nav: styled({
                lineHeight: "1.5em",
                textAlign: "center",
            })(layoutBase.nav),

            navTable: styled({
                lineHeight: "1.5em",
                textAlign: "center",
            })(tableBase.table),

            navTableTd: styled({
                margin: 0,
                padding: 0,
            })(tableBase.td),

            selectedLink: styled({
                color: "#3497ff",
                fontWeight: "bold",
            })(textBase.a),
        };
    }

    static propTypes = {
        initialActiveTabId: PropTypes.string,
        onTabChange: PropTypes.func.isRequired,
        shouldShowBackButton: PropTypes.bool.isRequired,
        links: PropTypes.arrayOf(
            PropTypes.shape({
                tabId: PropTypes.string.isRequired,
                translationKey: PropTypes.string.isRequired,
            })).isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    handleClick(e) {
        if (e.target.tagName === "A") {
            const href = e.target.getAttribute("href");

            if (typeof href === "string" && href.startsWith("#")) {
                const tabId = href.replace("#", "");

                e.preventDefault();

                this.props.onTabChange(tabId);

                return false;
            }

            // TODO: warn about mismatched link style?
        }
    }

    render() {
        const {
            links,
            initialActiveTabId,
            translate,
            shouldShowBackButton,
            configure,
        } = this.props;

        const linkCells = links
            .map((link) => {
                const SelectedLinkType = initialActiveTabId === link.tabId
                    ? this.styled.selectedLink
                    : textBase.a;

                return (
                    <this.styled.navTableTd
                        key={link.tabId}
                        onClick={this.handleClick}
                    >
                        <SelectedLinkType
                            href={"#" + link.tabId}
                        >
                            {translate(link.translationKey)}
                        </SelectedLinkType>
                    </this.styled.navTableTd>
                );
            }
        );

        let backButton = null;

        if (shouldShowBackButton) {
            backButton = <this.styled.backButton href={configure("urls.popup-passclick-false")}>
                ←
            </this.styled.backButton>;
        }

        return (
            <this.styled.nav className="columns">
                <this.styled.navTable>
                    <colgroup>
                        <col width="0*" />
                        <col width="25%" colSpan="4" />
                    </colgroup>
                    <tableBase.tbody>
                        <tableBase.tr>
                            <this.styled.navTableTd>
                                {backButton}
                            </this.styled.navTableTd>
                            {linkCells}
                        </tableBase.tr>
                    </tableBase.tbody>
                </this.styled.navTable>
            </this.styled.nav>
        );
    }
}
