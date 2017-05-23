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

import configure from "../../hocs/configure.jsx";
import translate from "../../hocs/translate.jsx";

@configure
@translate
export default class Donate extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    static defaultProps = {
        hideDonations: false,
    };

    static propTypes = {
        hideDonations: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    };

    handleChange(e) {
        const hideDonations = e.target.checked === true;

        this.props.onChange(hideDonations);
    }

    render() {
        return (
            <section>
                <h2>{this.props.translate("frontend_hideDonateButtonsInPopupHeading")}</h2>

                <p className="talkie-premium-only talkie-block">{this.props.translate("frontend_donate_alreadyHavePremium")}</p>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            id="options-popup-donate-buttons-hide"
                            checked={this.props.hideDonations}
                            onChange={this.handleChange}
                        />
                        {" "}
                        {this.props.translate("frontend_hideDonateButtonsInPopup")}</label>
                </p>

                <p>{this.props.translate("frontend_hideDonateButtonsInPopupDescription")}</p>
                <p>
                    <span className="talkie-free-only talkie-inline"><a href={this.props.configure("urls.store-premium")}>{this.props.translate("frontend_getPremiumLinkText")}</a> — </span>{this.props.translate("frontend_yourDonationsAreAppreciated")}
                </p>
                <table className="donate">
                    <tbody>
                        <tr>
                            <td>
                                <a href="https://joelpurra.com/donate/proceed/?amount=5&currency=usd"><kbd>{this.props.translate("frontend_donate_usd5Now")}</kbd></a>
                            </td>
                            <td>
                                <a href="https://joelpurra.com/donate/proceed/?amount=25&currency=usd"><kbd>{this.props.translate("frontend_donate_usd25Now")}</kbd></a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <a href="https://joelpurra.com/donate/proceed/?amount=100&currency=usd&invoice=true"><kbd>{this.props.translate("frontend_donate_usd100Now")}</kbd></a>
                            </td>
                            <td>
                                <a href="https://joelpurra.com/donate/"><kbd>{this.props.translate("frontend_donate_moreOptions")}</kbd></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        );
    }
}
