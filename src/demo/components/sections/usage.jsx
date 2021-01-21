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

import React from "react";
import PropTypes from "prop-types";

import configureAttribute from "../../../shared/hocs/configure.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import styled from "../../../shared/hocs/styled.jsx";

import * as textBase from "../../../shared/styled/text/text-base.jsx";
import * as lighter from "../../../shared/styled/text/lighter.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";
import * as tableBase from "../../../shared/styled/table/table-base.jsx";

import Discretional from "../../../shared/components/discretional.jsx";
import PremiumSection from "../../../shared/components/section/premium-section.jsx";
import Icon from "../../../shared/components/icon/icon.jsx";
import TalkieEditionIcon from "../../../shared/components/icon/talkie-edition-icon.jsx";
import TalkiePremiumIcon from "../../../shared/components/icon/talkie-premium-icon.jsx";

export default
@configureAttribute
@translateAttribute
class Usage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);

        this.styled = {
            shortcutKeysTable: styled({
                borderSpacing: 0,
            })(tableBase.table),

            shortcutKeysTd: styled({
                // text-align: __MSG_@@bidi_end_edge__;
                whiteSpace: "nowrap",
            })(tableBase.td),
        };
    }

    static defaultProps = {
        isPremiumEdition: false,
        systemType: null,
        osType: null,
    };

    static propTypes = {
        isPremiumEdition: PropTypes.bool.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        onOpenShortKeysConfigurationClick: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
        onConfigurationChange: PropTypes.func.isRequired,
    }

    handleOpenShortKeysConfigurationClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.onOpenShortKeysConfigurationClick();

        return false;
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
            osType,
            configure,
            translate,
        } = this.props;

        return (
            <section>
                <listBase.ul>
                    <listBase.li>
                        {translate("frontend_usageStep01")}
                    </listBase.li>
                    <listBase.li>
                        {translate("frontend_usageStep02")}
                        <TalkieEditionIcon
                            isPremiumEdition={isPremiumEdition}
                        />
                    </listBase.li>
                </listBase.ul>
                <p>
                    {translate("frontend_usageSelectionContextMenuDescription")}
                </p>

                {/* NOTE: read from clipboard feature not available in Firefox */}
                <Discretional
                    enabled={systemType === "chrome"}
                >
                    <PremiumSection
                        mode="p"
                    >
                        <p>
                            {translate("frontend_usageReadclipboard")}
                        </p>
                    </PremiumSection>
                </Discretional>

                <textBase.h2>
                    {translate("frontend_usageShortcutHeading")}
                </textBase.h2>

                <p>
                    {translate("frontend_usageShortcutKeyDescription")}
                </p>

                <div className="talkie-block">
                    <this.styled.shortcutKeysTable>
                        <colgroup>
                            <col width="100%" />
                            <col width="0*" />
                        </colgroup>
                        <tableBase.tbody>
                            <tableBase.tr>
                                <tableBase.td>
                                    <Icon className="icon-small-play" />
                                    <lighter.span>
                                    /
                                    </lighter.span>
                                    <Icon className="icon-small-stop" />

                                    {translate("frontend_usageShortcutKeyDescriptionStartStopWithMenu")}
                                </tableBase.td>
                                <this.styled.shortcutKeysTd>
                                    <Discretional
                                        enabled={osType === "mac"}
                                    >
                                        <textBase.kbd>
                                                ⌥
                                        </textBase.kbd>
                                    </Discretional>

                                    <Discretional
                                        enabled={osType !== "mac"}
                                    >
                                        <textBase.kbd>
                                                Alt
                                        </textBase.kbd>
                                    </Discretional>

                                    +
                                    <textBase.kbd>
                                        Shift
                                    </textBase.kbd>
                                        +
                                    <textBase.kbd>
                                        A
                                    </textBase.kbd>
                                </this.styled.shortcutKeysTd>
                            </tableBase.tr>

                            {/* NOTE: Shortcut key already in use in Firefox */}
                            <Discretional
                                enabled={systemType === "chrome"}
                            >
                                <tableBase.tr>
                                    <tableBase.td>
                                        <Icon className="icon-small-play" />
                                        <lighter.span>
                                        /
                                        </lighter.span>
                                        <Icon className="icon-small-stop" />

                                        {translate("frontend_usageShortcutKeyDescriptionStartStopWithoutMenu")}
                                    </tableBase.td>
                                    <this.styled.shortcutKeysTd>
                                        <Discretional
                                            enabled={osType === "mac"}
                                        >
                                            <textBase.kbd>
                                                    ⌘
                                            </textBase.kbd>
                                        </Discretional>

                                        <Discretional
                                            enabled={osType !== "mac"}
                                        >
                                            <textBase.kbd>
                                                    Ctrl
                                            </textBase.kbd>
                                        </Discretional>

                                        +
                                        <textBase.kbd>
                                            Shift
                                        </textBase.kbd>
                                        +
                                        <textBase.kbd>
                                            A
                                        </textBase.kbd>
                                    </this.styled.shortcutKeysTd>
                                </tableBase.tr>
                            </Discretional>

                            {/* NOTE: read from clipboard feature not available in Firefox */}
                            <Discretional
                                enabled={systemType === "chrome"}
                            >
                                <tableBase.tr className="premium-section">
                                    <tableBase.td colSpan="2">
                                        <textBase.a
                                            href={configure("urls.options-upgrade-from-demo")}
                                            lang="en"
                                        >
                                            <TalkiePremiumIcon />
                                            {translate("extensionShortName_Premium")}
                                        </textBase.a>
                                    </tableBase.td>
                                </tableBase.tr>
                            </Discretional>

                            {/* NOTE: read from clipboard feature not available in Firefox */}
                            <Discretional
                                enabled={systemType === "chrome"}
                            >
                                <tableBase.tr className="premium-section">
                                    <tableBase.td>
                                        <Icon className="icon-small-speaker" />

                                        {translate("frontend_usageShortcutKeyDescriptionReadFromClipboard")}
                                    </tableBase.td>
                                    <this.styled.shortcutKeysTd>
                                        <Discretional
                                            enabled={osType === "mac"}
                                        >
                                            <textBase.kbd>
                                                    ⌘
                                            </textBase.kbd>
                                        </Discretional>

                                        <Discretional
                                            enabled={osType !== "mac"}
                                        >
                                            <textBase.kbd>
                                                    Ctrl
                                            </textBase.kbd>
                                        </Discretional>

                                        +
                                        <textBase.kbd>
                                            Shift
                                        </textBase.kbd>
                                        +
                                        <textBase.kbd>
                                            1
                                        </textBase.kbd>
                                    </this.styled.shortcutKeysTd>
                                </tableBase.tr>
                            </Discretional>
                        </tableBase.tbody>
                    </this.styled.shortcutKeysTable>
                </div>

                <lighter.p>
                    {translate("frontend_usageShortcutKeyAlternative03")}
                </lighter.p>

                {/* NOTE: can't change shortcut keys in Firefox */}
                <Discretional
                    enabled={systemType === "chrome"}
                >
                    <p>
                        <textBase.a
                            href={configure("urls.shortcut-keys")}
                            onClick={this.handleOpenShortKeysConfigurationClick}
                        >
                            {translate("frontend_usageShortcutKeyAlternative04")}
                        </textBase.a>
                    </p>
                </Discretional>
            </section>
        );
    }
}
