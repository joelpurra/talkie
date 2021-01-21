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

import styled from "../../hocs/styled.jsx";

import * as formBase from "../../styles/form/form-base";

export default
@styled(formBase.checkbox)
class Checkbox extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    static defaultProps = {
        checked: false,
        disabled: false,
        onChange: null,
        className: "",
    };

    static propTypes = {
        checked: PropTypes.bool.isRequired,
        disabled: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        className: PropTypes.string.isRequired,
    }

    handleOnChange({ target }) {
        this.props.onChange(target.checked === true);
    }

    render() {
        const {
            checked,
            disabled,
            className,
        } = this.props;

        return (
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled || null}
                onChange={this.handleOnChange}
                className={className}
            />
        );
    }
}
