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
export default class Usage extends React.Component {
    constructor(props) {
        super(props);

        this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);
    }

    static propTypes = {
        onOpenShortKeysConfigurationClick: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    handleOpenShortKeysConfigurationClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.onOpenShortKeysConfigurationClick();

        return false;
    }

    render() {
        return (
            <section>
                <h3>{this.props.translate("frontend_usageHeading")}</h3>
                <ul>
                    <li>
                        {this.props.translate("frontend_usageStep01")}
                    </li>
                    <li>
                        {this.props.translate("frontend_usageStep02")}
                        {" "}
                        <span className="icon icon-inline icon-16px icon-talkie"></span>
                    </li>
                </ul>
                <p>{this.props.translate("frontend_usageSelectionContextMenuDescription")}</p>

                {/* NOTE: read from clipboard feature not available in Firefox */}
                <div className="talkie-chrome-only talkie-block premium-section">
                    <p><a href={this.props.configure("urls.store-premium")}><span className="icon icon-inline icon-16px icon-talkie premium"></span>Talkie Premium</a></p>
                    <p>
                        {this.props.translate("frontend_usageReadclipboard")}
                    </p>
                </div>

                <h2>{this.props.translate("frontend_usageShortcutHeading")}
                    {" "}
                    <span className="talkie-mac-only talkie-inline">
                        macOS
                    </span>

                    <span className="talkie-non-mac-only talkie-inline">
                        Windows, Linux, Chrome OS
                    </span>
                </h2>

                <p>{this.props.translate("frontend_usageShortcutKeyDescription")}</p>

                <div className="talkie-non-mac-only talkie-block">
                    <table className="shortcut-keys-table">
                        <colgroup>
                            <col width="100%" />
                            <col width="0*" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>
                                    <span className="lighter">
                                        <span className="icon icon-inline icon-16px icon-small-play"></span>
                                        /
                                        <span className="icon icon-inline icon-16px icon-small-stop"></span>
                                    </span>

                                    {this.props.translate("frontend_usageShortcutKeyDescriptionStartStopWithMenu")}
                                </td>
                                <td>
                                    <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>
                                </td>
                            </tr>
                            {/* NOTE: Shortcut key already in use in Firefox */}
                            <tr className="talkie-chrome-only talkie-table-row">
                                <td>
                                    <span className="lighter">
                                        <span className="icon icon-inline icon-16px icon-small-play"></span>
                                        /
                                        <span className="icon icon-inline icon-16px icon-small-stop"></span>
                                    </span>

                                    {this.props.translate("frontend_usageShortcutKeyDescriptionStartStopWithoutMenu")}
                                </td>
                                <td>
                                    <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>
                                </td>
                            </tr>
                            {/* NOTE: read from clipboard feature not available in Firefox  */}
                            {/* NOTE: read from clipboard feature not available in Firefox */}
                            <tr className="talkie-chrome-only talkie-table-row premium-section">
                                <td colSpan="2">
                                    <a href={this.props.configure("urls.store-premium")}><span className="icon icon-inline icon-16px icon-talkie premium"></span>Talkie Premium</a>
                                </td>
                            </tr>
                            <tr className="talkie-chrome-only talkie-table-row premium-section">
                                <td>
                                    <span className="icon icon-inline icon-16px icon-small-speaker"></span>

                                    {this.props.translate("frontend_usageShortcutKeyDescriptionReadFromClipboard")}
                                </td>
                                <td>
                                    <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="talkie-mac-only talkie-block">
                    <table className="shortcut-keys-table">
                        <colgroup>
                            <col width="100%" />
                            <col width="0*" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>
                                    <span className="lighter">
                                        <span className="icon icon-inline icon-16px icon-small-play"></span>
                                        /
                                        <span className="icon icon-inline icon-16px icon-small-stop"></span>
                                    </span>

                                    {this.props.translate("frontend_usageShortcutKeyDescriptionStartStopWithMenu")}
                                </td>
                                <td>
                                    <kbd>⌥</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>
                                </td>
                            </tr>
                            {/* NOTE: Shortcut key already in use in Firefox */}
                            <tr className="talkie-chrome-only talkie-table-row">
                                <td>
                                    <span className="lighter">
                                        <span className="icon icon-inline icon-16px icon-small-play"></span>
                                        /
                                        <span className="icon icon-inline icon-16px icon-small-stop"></span>
                                    </span>

                                    {this.props.translate("frontend_usageShortcutKeyDescriptionStartStopWithoutMenu")}
                                </td>
                                <td>
                                    <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>
                                </td>
                            </tr>
                            {/* NOTE: read from clipboard feature not available in Firefox */}
                            <tr className="talkie-chrome-only talkie-table-row premium-section">
                                <td colSpan="2">
                                    <a href={this.props.configure("urls.store-premium")}><span className="icon icon-inline icon-16px icon-talkie premium"></span>Talkie Premium</a>
                                </td>
                            </tr>
                            <tr className="talkie-chrome-only talkie-table-row premium-section">
                                <td>
                                    <span className="icon icon-inline icon-16px icon-small-speaker"></span>

                                    {this.props.translate("frontend_usageShortcutKeyDescriptionReadFromClipboard")}
                                </td>
                                <td>
                                    <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="lighter">
                    {this.props.translate("frontend_usageShortcutKeyAlternative03")}
                </p>

                <p className="talkie-chrome-only talkie-block">
                    {/* NOTE: can't change shortcut keys in Firefox */}
                    <a
                        href={this.props.configure("urls.shortcut-keys")}
                        onClick={this.handleOpenShortKeysConfigurationClick}
                    >{this.props.translate("frontend_usageShortcutKeyAlternative04")}</a>
                </p>
            </section>
        );
    }
}
