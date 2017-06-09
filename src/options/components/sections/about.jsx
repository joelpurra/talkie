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
export default class About extends React.Component {
    constructor(props) {
        super(props);

        this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
    }

    static defaultProps = {
        versionName: null,
    };

    static propTypes = {
        versionName: PropTypes.string,
        onLicenseClick: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    handleLegaleseClick(e) {
        const legaleseText = e.target.textContent;

        this.props.onLicenseClick(legaleseText);
    }

    render() {
        return (
            <section>
                <p><span className="icon icon-inline icon-16px icon-talkie"></span>Talkie {this.props.versionName}</p>

                <ul>
                    <li>
                        <a href={this.props.configure("urls.support-feedback")}>{this.props.translate("frontend_supportAndFeedback")}</a>
                    </li>
                    <li>
                        <a href={this.props.configure("urls.rate")}>{this.props.translate("frontend_rateIt")}</a>
                    </li>
                    <li>
                        <a href={this.props.configure("urls.project")}>{this.props.translate("frontend_aboutProjectPageLinkText")}</a>
                    </li>
                    <li>
                        <a href={this.props.configure("urls.github")}>{this.props.translate("frontend_aboutCodeOnGithubLinkText")}</a>
                    </li>
                    <li className="talkie-free-only talkie-list-item">
                        <a href={this.props.configure("urls.store-premium")}>Talkie Premium</a>
                    </li>
                </ul>

                <h2>{this.props.translate("frontend_shareHeading")}</h2>

                <ul className="inline">
                    <li>
                        <a href={this.props.configure("urls.share.twitter")}><span className="icon icon-inline icon-24px icon-share icon-twitter"></span></a>
                    </li>
                    <li>
                        <a href={this.props.configure("urls.share.facebook")}><span className="icon icon-inline icon-24px icon-share icon-facebook"></span></a>
                    </li>
                    <li>
                        <a href={this.props.configure("urls.share.googleplus")}><span className="icon icon-inline icon-24px icon-share icon-googleplus"></span></a>
                    </li>
                    <li>
                        <a href={this.props.configure("urls.share.linkedin")}><span className="icon icon-inline icon-24px icon-share icon-linkedin"></span></a>
                    </li>
                </ul>

                <h2>{this.props.translate("frontend_storyHeading")}</h2>
                <p>{this.props.translate("frontend_storyDescription")}</p>
                <p>{this.props.translate("frontend_storyThankYou")}</p>
                <p>
                    — <a href="https://joelpurra.com/">Joel Purra</a>
                </p>

                <h2>{this.props.translate("frontend_licenseHeading")}</h2>
                <p>
                    <span
                        onClick={this.handleLegaleseClick}
                    >{this.props.translate("frontend_licenseGPLDescription")}</span>
                    <br />
                    <a href={this.props.configure("urls.gpl")}>{this.props.translate("frontend_licenseGPLLinkText")}</a>
                </p>
                <p>
                    {this.props.translate("frontend_licenseCLADescription")}
                    <br />
                    <a href={this.props.configure("urls.cla")}>{this.props.translate("frontend_licenseCLALinkText")}</a>
                </p>
            </section>
        );
    }
}
