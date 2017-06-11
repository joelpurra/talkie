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

import configure from "../../hocs/configure.jsx";
import translate from "../../hocs/translate.jsx";

@configure
@translate
export default class Nav extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
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
        const linkCells = this.props.links
            .map((link) => (
                <td
                    key={link.tabId}
                    className={this.props.initialActiveTabId === link.tabId ? "tabrowselected" : ""}
                    onClick={this.handleClick}
                >
                    <a
                        href={"#" + link.tabId}
                    >{this.props.translate(link.translationKey)}</a>
                </td>
            )
        );

        let backButton = null;

        if (this.props.shouldShowBackButton) {
            backButton = <a href={this.props.configure("urls.popup-passclick-false")} id="back-to-popup">←</a>;
        }

        return (
            <nav className="columns">
                <table>
                    <colgroup>
                        <col width="0*" />
                        <col width="25%" colSpan="4" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                {backButton}
                            </td>
                            {linkCells}
                            </tr>
                    </tbody>
                </table>
            </nav>
        );
    }
}
