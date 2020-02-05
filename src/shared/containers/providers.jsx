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

import {
    StyletronProvider,
} from "styletron-react";

import ConfigurationProvider from "../hocs/configuration-provider.jsx";

import TranslationProvider from "../hocs/translation-provider.jsx";

import BroadcasterProvider from "../hocs/broadcaster-provider.jsx";

import StateRoot from "./state-root.jsx";

export default class Providers extends React.PureComponent {
    static propTypes = {
        broadcaster: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired,
        configuration: PropTypes.object.isRequired,
        styletron: PropTypes.object.isRequired,
        translator: PropTypes.object.isRequired,
    }

    render() {
        const {
            broadcaster,
            configuration,
            styletron,
            translator,
        } = this.props;

        return (
            <ConfigurationProvider configuration={configuration}>
                <TranslationProvider translator={translator}>
                    <BroadcasterProvider broadcaster={broadcaster}>
                        <StyletronProvider styletron={styletron}>
                            <StateRoot>
                                {React.Children.only(this.props.children)}
                            </StateRoot>
                        </StyletronProvider>
                    </BroadcasterProvider>
                </TranslationProvider>
            </ConfigurationProvider>
        );
    }
}
