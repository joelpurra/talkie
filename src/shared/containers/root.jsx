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

import {
    Provider,
} from "react-redux";

import Providers from "./providers.jsx";

export default class Root extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired,
        translator: PropTypes.object.isRequired,
        broadcaster: PropTypes.object.isRequired,
        styletron: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired,
    };

    render() {
        const {
             broadcaster,
             configuration,
             store,
             styletron,
             translator,
          } = this.props;

        return (
            <Provider store={store}>
                <Providers configuration={configuration} translator={translator} broadcaster={broadcaster} styletron={styletron}>
                    {React.Children.only(this.props.children)}
                </Providers>
            </Provider>
        );
    }
}
