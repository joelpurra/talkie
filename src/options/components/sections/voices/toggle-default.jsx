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

import PropTypes from "prop-types";
import React from "react";

import translateAttribute from "../../../../shared/hocs/translate.jsx";
import * as formBase from "../../../../shared/styled/form/form-base.jsx";
import * as tableBase from "../../../../shared/styled/table/table-base.jsx";

export default
@translateAttribute
class ToggleDefault extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

    static defaultProps = {
    	languageCode: null,
    	voiceName: null,
    	disabled: true,
    };

    static propTypes = {
    	onClick: PropTypes.func.isRequired,
    	languageCode: PropTypes.string,
    	voiceName: PropTypes.string,
    	disabled: PropTypes.bool.isRequired,
    	translate: PropTypes.func.isRequired,
    };

    handleClick(/* eslint-disable no-unused-vars */e/* eslint-enable no-unused-vars */) {
    	this.props.onClick();
    }

    render() {
    	const {
    		disabled,
    		languageCode,
    		translate,
    		voiceName,
    	} = this.props;

    	let buttonText = null;

    	if (languageCode === null || voiceName === null) {
    		buttonText = translate("frontend_voicesSetAsLanguageEmptySelection");
    	} else {
    		const messageDetailsPlaceholders = [
    			languageCode,
    			voiceName,
    		];

    		buttonText = translate("frontend_voicesSetAsLanguageUseVoiceAsDefault", messageDetailsPlaceholders);
    	}

    	return (
    		<tableBase.tbody>
    			<tableBase.tr>
    				<tableBase.td>
    					<formBase.button
    						disabled={disabled || null}
    						onClick={this.handleClick}
	>
    						{buttonText}
 </formBase.button>
 </tableBase.td>
 </tableBase.tr>
 </tableBase.tbody>
    	);
    }
}
