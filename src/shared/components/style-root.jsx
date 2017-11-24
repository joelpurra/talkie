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

export default class StyleRoot extends React.Component {
    static defaultProps = {
        isSpeaking: false,
        isPremiumVersion: false,
        systemType: null,
        osType: null,
    };

    static propTypes = {
        isSpeaking: PropTypes.bool.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        systemType: PropTypes.string,
        osType: PropTypes.string,
        children: PropTypes.element.isRequired,
    }

    getStateClasses() {
        const {
            isSpeaking,
            isPremiumVersion,
            systemType,
            osType,
        } = this.props;

        const stateClasses = [];

        if (isSpeaking) {
            stateClasses.push("talkie-speaking");
        } else {
            stateClasses.push("talkie-not-speaking");
        }

        if (isPremiumVersion) {
            stateClasses.push("talkie-premium");
        } else {
            stateClasses.push("talkie-free");
        }

        if (systemType) {
            if (systemType === "chrome") {
                stateClasses.push("talkie-chrome");
            } else {
                stateClasses.push("talkie-webextension");
            }
        }

        if (osType) {
            if (this.props.osType === "mac") {
                stateClasses.push("talkie-mac");
            } else {
                stateClasses.push("talkie-non-mac");
            }
        }

        return stateClasses;
    }

    render() {
        const {
            children,
        } = this.props;

        const stateClasses = this.getStateClasses();
        const stateClassNames = stateClasses.join(" ");

        return <div
            className={stateClassNames}
        >
            {React.Children.only(children)}
        </div>;
    }
}
