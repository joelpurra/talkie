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
    static propTypes = {
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
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
                        <span className="icon inline talkie"></span>
                    </li>
                </ul>
                <p>{this.props.translate("frontend_usageSelectionContextMenuDescription")}</p>
                <p>{this.props.translate("frontend_usageShortcutKeyDescription")}</p>
                <div className="talkie-non-mac-only talkie-block">
                    Windows, Linux, Chrome OS:
                    <ul>
                        <li>
                            <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>
                            {" "}
                            {this.props.translate("frontend_usageShortcutKeyDescriptionStartStopWithMenu")}
                        </li>
                        <li className="talkie-chrome-only talkie-list-item">
                            {/* NOTE: Shortcut key already in use in Firefox */}
                            <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>
                            {" "}
                            {this.props.translate("frontend_usageShortcutKeyDescriptionStartStopWithoutMenu")}
                        </li>
                        <li className="talkie-chrome-only talkie-list-item">
                            {/* NOTE: read from clipboard feature not available in Firefox  */}
                            <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd>
                            {" "}
                            {this.props.translate("frontend_usageShortcutKeyDescriptionReadFromClipboard")}
                        </li>
                    </ul>
                </div>
                <div className="talkie-mac-only talkie-block">
                    macOS:
                    <ul>
                        <li>
                            <kbd>⌥</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>
                            {" "}
                            {this.props.translate("frontend_usageShortcutKeyDescriptionStartStopWithMenu")}
                        </li>
                        <li className="talkie-chrome-only talkie-list-item">
                            {/* NOTE: Shortcut key already in use in Firefox */}
                            <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>
                            {" "}
                            {this.props.translate("frontend_usageShortcutKeyDescriptionStartStopWithoutMenu")}
                        </li>
                        <li className="talkie-chrome-only talkie-list-item">
                            {/* NOTE: read from clipboard feature not available in Firefox */}
                            <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd>
                            {" "}
                            {this.props.translate("frontend_usageShortcutKeyDescriptionReadFromClipboard")}
                        </li>
                    </ul>
                </div>
                <ul>
                    <li>
                        {this.props.translate("frontend_usageShortcutKeyAlternative03")}
                    </li>
                    <li className="talkie-chrome-only talkie-list-item">
                        {/* NOTE: can't change shortcut keys in Firefox */}
                        <a href={this.props.configure("urls.shortcut-keys")}>{this.props.translate("frontend_usageShortcutKeyAlternative04")}</a>
                    </li>
                </ul>
                {/* NOTE: read from clipboard feature not available in Firefox */}
                <p className="talkie-chrome-only talkie-block">{this.props.translate("frontend_usageReadclipboard")}</p>
            </section>
        );
    }
}
