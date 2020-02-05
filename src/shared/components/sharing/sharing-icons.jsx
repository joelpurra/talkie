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

import configureAttribute from "../../hocs/configure.jsx";

import * as listBase from "../../styled/list/list-base.jsx";
import * as textBase from "../../styled/text/text-base.jsx";

import SocialShareIcon from "../icon/social-share-icon.jsx";

export default
@configureAttribute
class SharingIcons extends React.PureComponent {
    static defaultProps = {
        className: "",
    };

    static propTypes = {
        configure: PropTypes.func.isRequired,
        className: PropTypes.string.isRequired,
    };

    render() {
        const {
            className,
            configure,
        } = this.props;

        return (
            <listBase.inlineUl className={className}>
                <listBase.inlineLi>
                    <textBase.a href={configure("urls.share.twitter")}>
                        <SocialShareIcon mode="standalone" size="2em" network="twitter" />
                    </textBase.a>
                </listBase.inlineLi>
                <listBase.inlineLi>
                    <textBase.a href={configure("urls.share.facebook")}>
                        <SocialShareIcon mode="standalone" size="2em" network="facebook" />
                    </textBase.a>
                </listBase.inlineLi>
                <listBase.inlineLi>
                    <textBase.a href={configure("urls.share.googleplus")}>
                        <SocialShareIcon mode="standalone" size="2em" network="googleplus" />
                    </textBase.a>
                </listBase.inlineLi>
                <listBase.inlineLi>
                    <textBase.a href={configure("urls.share.linkedin")}>
                        <SocialShareIcon mode="standalone" size="2em" network="linkedin" />
                    </textBase.a>
                </listBase.inlineLi>
            </listBase.inlineUl>
        );
    }
}
