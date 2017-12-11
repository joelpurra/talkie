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

import * as layoutBase from "../../styled/layout/layout-base.jsx";

import styled from "../../hocs/styled.jsx";

export default class HeroSection extends React.PureComponent {
    constructor(props) {
        super(props);

        this.styled = {
            heroFree: styled({

            })(layoutBase.hero),

            heroPremium: styled({

            })(layoutBase.hero),
        };
    }

    static defaultProps = {
        isPremiumVersion: false,
        className: "",
    };

    static propTypes = {
        isPremiumVersion: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
        className: PropTypes.string.isRequired,
    }

    render() {
        const {
            isPremiumVersion,
            className,
        } = this.props;

        const HeroElement = isPremiumVersion ? this.styled.heroPremium : this.styled.heroFree;

        return (
            <HeroElement className={className}>
                {this.props.children}
            </HeroElement>
        );
    }
}
