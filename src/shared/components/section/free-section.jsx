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

import configureAttribute from "../../hocs/configure.jsx";

import * as textBase from "../../styled/text/text-base.jsx";

import TalkieFreeIcon from "../icon/talkie-free-icon.jsx";

@configureAttribute
export default class FreeSection extends React.Component {
    static defaultProps = {
        mode: "h2",
        className: "",
    };

    static propTypes = {
        mode: PropTypes.oneOf(["p", "h2"]).isRequired,
        children: PropTypes.node.isRequired,
        configure: PropTypes.func.isRequired,
        className: PropTypes.string.isRequired,
    }

    render() {
        const {
            mode,
            configure,
            className,
        } = this.props;

        const classNames = [
            "free-section",
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
                    <textBase.a href={configure("urls.store-free")}>
                        <TalkieFreeIcon />
                        Talkie
                    </textBase.a>
                </HeadingElement>

                {this.props.children}
            </div>
        );
    }
}
