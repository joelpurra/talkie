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

import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import React from "react";

import Checkbox from "../../../components/form/checkbox.js";

export interface TalkiePremiumEditionProps {
	disabled: boolean;
	isPremiumEdition: boolean;
	onChange: (isPremiumEdition: boolean) => void;
}

class TalkiePremiumEdition<P extends TalkiePremiumEditionProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(isPremiumEdition: boolean): void {
		this.props.onChange(isPremiumEdition);
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			disabled,
			translateSync,
			configure,
		} = this.props;

		return (
			<>
				<p>
					{translateSync("frontend_upgradeExplanation01")}
				</p>
				<p>
					{translateSync("frontend_upgradeExplanation02")}
				</p>
				<ul>
					<li>
						<a href={configure("urls.primary-payment")}>
							{translateSync("frontend_upgradePaymentPrimaryLinkText")}
						</a>
					</li>
					<li>
						<a href={configure("urls.alternative-payment")}>
							{translateSync("frontend_upgradePaymentAlternativesLinkText")}
						</a>
					</li>
				</ul>
				<p>
					{translateSync("frontend_upgradeExplanation03")}
				</p>
				<p>
					<label>
						<Checkbox
							checked={isPremiumEdition}
							disabled={disabled}
							onChange={this.handleChange}
						/>
						{" "}
						{translateSync("frontend_upgradeLabel")}
					</label>
				</p>
				<p>
					{translateSync("frontend_upgradeExplanation04")}
				</p>
			</>
		);
	}
}

export default translateAttribute<TalkiePremiumEditionProps & TranslateProps>()(
	configureAttribute<TalkiePremiumEditionProps & ConfigureProps & TranslateProps>()(
		TalkiePremiumEdition,
	),
);
