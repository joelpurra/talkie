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

import LogarithmicScaleRange from "../../range/logarithmic-scale-range.jsx";

import RangeWithHeading from "./range-with-heading.jsx";

export default class Rate extends React.PureComponent {
    constructor(props) {
        super(props);

        this.transformValueBeforeChange = this.transformValueBeforeChange.bind(this);
        this.getHeading = this.getHeading.bind(this);
    }

    transformValueBeforeChange(value) {
        // NOTE: step 0.1 for outside this component.
        const rounded = Math.round10(value, -1);

        return rounded;
    }

    getHeading(voiceName, translate) {
        let heading = null;

        if (typeof voiceName === "string" && voiceName.length > 0) {
            heading = translate("frontend_voicesRateHeading", voiceName);
        } else {
            heading = translate("frontend_voicesRateEmptyHeading");
        }

        return heading;
    }

    render() {
        return (
            <RangeWithHeading
                {...this.props}
                transformValueBeforeChange={this.transformValueBeforeChange}
                getHeading={this.getHeading}
                ScaleRangeElementClass={LogarithmicScaleRange}
            />
        );
    }
}
