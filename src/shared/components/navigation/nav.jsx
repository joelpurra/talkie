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

import styled from "../../hocs/styled.jsx";

import * as layoutBase from "../../styled/layout/layout-base.jsx";
import * as textBase from "../../styled/text/text-base.jsx";
import * as tableBase from "../../styled/table/table-base.jsx";

export default class Nav extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.styled = {
            nav: styled({
                lineHeight: "1.5em",
                textAlign: "center",
            })(layoutBase.nav),

            navTable: styled({
                lineHeight: "1.5em",
                textAlign: "center",
            })(tableBase.table),

            navTableTd: styled({
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
            })(tableBase.td),

            selectedLink: styled({
                color: "#3497ff",
                fontWeight: "bold",
            })(textBase.a),
        };
    }

    static propTypes = {
        initialActiveTabId: PropTypes.string.isRequired,
        onTabChange: PropTypes.func.isRequired,
        links: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string,
                tabId: PropTypes.string,
                text: PropTypes.string.isRequired,
            })).isRequired,
    }

    handleClick(e) {
        if (e.target.tagName === "A") {
            const href = e.target.getAttribute("href");

            if (typeof href === "string" && href.startsWith("#")) {
                const tabId = href.replace("#", "");

                e.preventDefault();
                e.stopPropagation();

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
        } = this.props;

        const linkCells = links
            .map((link) => {
                const SelectedLinkType = initialActiveTabId === link.tabId
                    ? this.styled.selectedLink
                    : textBase.a;

                const url = link.url || "#" + link.tabId;

                return (
                    <this.styled.navTableTd
                        key={link.tabId}
                        onClick={this.handleClick}
                    >
                        <SelectedLinkType
                            href={url}
                        >
                            {link.text}
                        </SelectedLinkType>
                    </this.styled.navTableTd>
                );
            });

        const colCount = linkCells.length;
        const colWidth = `${100 / linkCells.length}%`;

        return (
            <this.styled.nav className="columns">
                <this.styled.navTable>
                    <colgroup>
                        <col width={colWidth} colSpan={colCount} />
                    </colgroup>
                    <tableBase.tbody>
                        <tableBase.tr>
                            {linkCells}
                        </tableBase.tr>
                    </tableBase.tbody>
                </this.styled.navTable>
            </this.styled.nav>
        );
    }
}
