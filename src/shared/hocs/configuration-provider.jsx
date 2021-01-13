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

export default class ConfigurationProvider extends React.PureComponent {
    constructor(props) {
        super(props);

        this._listeners = {};
        this._counter = 0;
    }

    static propTypes = {
        children: PropTypes.element.isRequired,
        configuration: PropTypes.object.isRequired,
        systemType: PropTypes.string.isRequired,
    }

    static childContextTypes = {
        // NOTE: uses hacky workaround for dynamically updating "semi-static" context values and updating "deep" components
        // which may be obscured descendants of a PureComponent (or otherwise set shouldComponentUpdate to false).
        // https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076
        // TODO: find a better solution to look up arbitrary (although it's a short list) configuration values.
        // TODO: use proper event listener system?
        onConfigurationChange: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.systemType !== nextProps.systemType) {
            this.onChange({
                systemType: nextProps.systemType,
            });
        }
    }

    getChildContext() {
        const { systemType } = this.props;

        return {
            onConfigurationChange: (listener) => this.registerListener(listener),
            /* eslint-disable no-sync */
            configure: (path) => this.props.configuration.getSync(systemType, path),
            /* eslint-enable no-sync */
        };
    }

    registerListener(listener) {
        const id = `listener-${this._counter.toString().padStart(4, "0")}}`;
        this._counter++;

        this._listeners[id] = listener;

        const unregisterListener = () => {
            if (!(id in this._listeners)) {
                throw new Error(`Listener id not found: ${JSON.stringify(id)}`);
            }

            delete this._listeners[id];
        };

        return unregisterListener;
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
