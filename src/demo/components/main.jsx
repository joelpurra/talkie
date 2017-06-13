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

import styled from "../../shared/hocs/styled.jsx";

import * as layoutBase from "../../shared/styled/layout/layout-base.jsx";
import * as listBase from "../../shared/styled/list/list-base.jsx";
import * as textBase from "../../shared/styled/text/text-base.jsx";

import {
    handleBubbledLinkClick,
} from "../../shared/utils/ui";

import Header from "./header.jsx";
import Footer from "./footer.jsx";

const styles = {
    minWidth: "400px",
    maxWidth: "600px",
    minHeight: "450px",
    maxHeight: "1000px",
    paddingBottom: "1em",
};

@styled(styles)
export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        // this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);
    }

    static defaultProps = {
        languages: [],
        voices: [],
        voicesCount: 0,
        languagesCount: 0,
        isPremiumVersion: false,
        versionName: null,
        systemType: null,
        osType: null,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        voices: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            lang: PropTypes.string.isRequired,
        })).isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        className: PropTypes.string.isRequired,
    };

    openUrlInNewTab(url) {
        this.props.actions.sharedNavigation.openUrlInNewTab(url);
    }

    // handleOpenShortKeysConfigurationClick() {
    //     this.props.actions.sharedNavigation.openShortKeysConfiguration();
    // }

    handleClick(e) {
        return handleBubbledLinkClick(this.openUrlInNewTab, e);
    }

    render() {
        const {
            languages,
            voices,
            voicesCount,
            languagesCount,
            isPremiumVersion,
            versionName,
            systemType,
            osType,
            className,
        } = this.props;

        const voicesList = voices.map((voice) =>
          <listBase.li key={voice.name}>
            {voice.name}
            {" "}
            ({voice.lang})
          </listBase.li>
        );

        const languagesList = languages.map((language) =>
          <listBase.li key={language}>
            {language}
          </listBase.li>
        );

        return (
            <div className={className}>
                <Header
                    isPremiumVersion={isPremiumVersion}
                />

                <layoutBase.hr />

                <layoutBase.main
                    onClick={this.handleClick}
                >
                    <textBase.h2>{languagesCount}</textBase.h2>

                    <listBase.ul>
                        {languagesList}
                    </listBase.ul>

                    <textBase.h2>{voicesCount}</textBase.h2>

                    <listBase.ul>
                        {voicesList}
                    </listBase.ul>
                </layoutBase.main>

                <layoutBase.hr />

                <Footer
                    isPremiumVersion={isPremiumVersion}
                    versionName={versionName}
                    systemType={systemType}
                    osType={osType}
                />
            </div>
        );
    }
}
