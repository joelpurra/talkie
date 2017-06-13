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

import configureAttribute from "../../shared/hocs/configure.jsx";
import translateAttribute from "../../shared/hocs/translate.jsx";
import styled from "../../shared/hocs/styled.jsx";

import * as layoutBase from "../../shared/styled/layout/layout-base.jsx";
import * as lighter from "../../shared/styled/text/lighter.jsx";

import TalkieVersionIcon from "../../shared/components/icon/talkie-version-icon.jsx";

const styles = {};

@configureAttribute
@translateAttribute
@styled(styles)
export default class Footer extends React.Component {
    static defaultProps = {
        isPremiumVersion: false,
        versionName: null,
        systemType: null,
        osType: null,
    };

    static propTypes = {
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
        className: PropTypes.string.isRequired,
    }

    render() {
        const {
            className,
            versionName,
            systemType,
            osType,
            isPremiumVersion,
            translate,
        } = this.props;

        return (
            <layoutBase.footer className={className}>
                <lighter.p>
                    <TalkieVersionIcon
                        isPremiumVersion={isPremiumVersion}
                    />

                    {translate("extensionShortName")}
                    {" "}
                    {versionName}
                    {" "}
                    ({systemType}/{osType})
                </lighter.p>
            </layoutBase.footer>
        );
    }
}
