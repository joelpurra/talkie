/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

import translateAttribute from "../../hocs/translate.jsx";
import configureAttribute from "../../hocs/configure.jsx";

import * as textBase from "../../styled/text/text-base.jsx";

import TalkieEditionIcon from "../icon/talkie-edition-icon.jsx";

export default
@translateAttribute
@configureAttribute
class EditionSection extends React.PureComponent {
    static defaultProps = {
        mode: "h2",
        isPremiumEdition: false,
        className: "",
    };

    static propTypes = {
        mode: PropTypes.oneOf(["p", "h2"]).isRequired,
        isPremiumEdition: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
        className: PropTypes.string.isRequired,
        configure: PropTypes.func.isRequired,
        onConfigurationChange: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this._unregisterConfigurationListener = this.props.onConfigurationChange(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this._unregisterConfigurationListener();
    }

    render() {
        const {
            mode,
            isPremiumEdition,
            className,
            translate,
            configure,
        } = this.props;

        // TODO: move resolving the name to the state, like edition type?
        const text = isPremiumEdition
            ? translate("extensionShortName_Premium")
            : translate("extensionShortName_Free");

        const versionClassName = isPremiumEdition ? "premium-section" : "free-section";

        const classNames = [
            versionClassName,
            className,
        ]
            .join(" ")
            .trim();

        let HeadingElement = null;

        switch (mode) {
        case "p":
            HeadingElement = textBase.p;
            break;

        case "h2":
            HeadingElement = textBase.h2;
            break;

        default:
            throw new Error("Uknown mode");
        }

        return (
            <div className={classNames}>
                <HeadingElement>
                    <textBase.a
                        href={configure("urls.options-upgrade-from-demo")}
                        lang="en"
                    >
                        <TalkieEditionIcon
                            isPremiumEdition={isPremiumEdition}
                        />
                        {text}
                    </textBase.a>
                </HeadingElement>

                {this.props.children}
            </div>
        );
    }
}
