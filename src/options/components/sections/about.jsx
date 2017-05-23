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
    static defaultProps = {
        versionName: null,
    };

    static propTypes = {
        versionName: PropTypes.string,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    render() {
        return (
            <section>
                <h2>{this.props.translate("frontend_aboutHeading")}</h2>
                <p><span className="icon inline talkie"></span>Talkie {this.props.versionName}</p>

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
                </ul>

                <p>{this.props.translate("frontend_aboutThankYou")}</p>

                <div className="store-links">
                    <p>
                        <a href={this.props.configure("urls.chromewebstore-free")}><img src="../../resources/chrome-web-store/ChromeWebStore_Badge_v2_206x58.png" alt="Talkie is available for installation from the Chrome Web Store" width="206" height="58" /><br /><span className="icon inline talkie free"></span>Talkie</a>
                    </p>
                    <p>
                        <a href={this.props.configure("urls.chromewebstore-premium")}><img src="../../resources/chrome-web-store/ChromeWebStore_Badge_v2_206x58.png" alt="Talkie Premium is available for installation from the Chrome Web Store" width="206" height="58" /><br /><span className="icon inline talkie premium"></span>Talkie Premium</a>
                    </p>
                </div>
                <div className="store-links">
                    <p>
                        <a href={this.props.configure("urls.firefox-amo-free")}><img src="../../resources/firefox-amo/AMO-button_1.png" alt="Talkie is available for installation from the Chrome Web Store" width="172" height="60" /><br /><span className="icon inline talkie free"></span>Talkie</a>
                    </p>
                    <p>
                        <a href={this.props.configure("urls.firefox-amo-premium")}><img src="../../resources/firefox-amo/AMO-button_1.png" alt="Talkie is available for installation from the Chrome Web Store" width="172" height="60" /><br /><span className="icon inline talkie premium"></span>Talkie Premium</a>
                    </p>
                </div>
            </section>
        );
    }
}
