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

import translateAttribute from "../../../shared/hocs/translate.jsx";
import configureAttribute from "../../../shared/hocs/configure.jsx";

import * as textBase from "../../../shared/styled/text/text-base.jsx";

import SharingIcons from "../../../shared/components/sharing/sharing-icons.jsx";

@translateAttribute
@configureAttribute
export default class About extends React.PureComponent {
    static propTypes = {
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    render() {
        const {
            translate,
            configure,
        } = this.props;

        return (
            <section>
                <textBase.h2>
                    {translate("frontend_storyHeading")}
                </textBase.h2>
                <textBase.p>
                    {translate("frontend_storyDescription")}
                </textBase.p>
                <textBase.p>
                    {translate("frontend_storyThankYou")}
                </textBase.p>
                <textBase.p>
                —
                    <textBase.a href="https://joelpurra.com/">
                    Joel Purra
                    </textBase.a>
                </textBase.p>

                <textBase.h2>
                    {translate("frontend_shareHeading")}
                </textBase.h2>

                <textBase.p>
                    {/* TODO: translate */}
                    Do you like {translate("extensionShortName")}? If so, I would be happy if you could <textBase.a href={configure("urls.rate")}>give it a nice ⭐️ rating</textBase.a> 😃
                </textBase.p>

                <SharingIcons />
            </section>
        );
    }
}
