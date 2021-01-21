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

import translateAttribute from "../../../../shared/hocs/translate.jsx";
import configureAttribute from "../../../../shared/hocs/configure.jsx";

import * as textBase from "../../../../shared/styled/text/text-base.jsx";

import Checkbox from "../../../../shared/components/form/checkbox.jsx";

export default
@translateAttribute
@configureAttribute
class TalkiePremiumEdition extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    static defaultProps = {
        isPremiumEdition: false,
        disabled: true,
    };

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        isPremiumEdition: PropTypes.bool.isRequired,
        disabled: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
        onConfigurationChange: PropTypes.func.isRequired,
    };

    handleChange(isPremiumEdition) {
        this.props.onChange(isPremiumEdition);
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
            disabled,
            translate,
            configure,
        } = this.props;

        return (
            <div>
                <textBase.h2 scope="col">
                    {translate("frontend_upgradeHeading")}
                </textBase.h2>
                <p>
                    {translate("frontend_upgradeExplanation01")}
                </p>
                <p>
                    {translate("frontend_upgradeExplanation02")}
                </p>
                <ul>
                    <li><a href={configure("urls.primary-payment")}>{translate("frontend_upgradePaymentPrimaryLinkText")}</a></li>
                    <li><a href={configure("urls.alternative-payment")}>{translate("frontend_upgradePaymentAlternativesLinkText")}</a></li>
                </ul>
                <p>
                    {translate("frontend_upgradeExplanation03")}
                </p>
                <p>
                    <label>
                        <Checkbox
                            checked={isPremiumEdition}
                            onChange={this.handleChange}
                            disabled={disabled}
                        />
                        {" "}
                        {translate("frontend_upgradeLabel")}
                    </label>
                </p>
                <p>
                    {translate("frontend_upgradeExplanation04")}
                </p>
            </div>
        );
    }
}
