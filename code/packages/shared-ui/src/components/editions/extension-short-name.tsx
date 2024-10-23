/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import translateAttribute, {
	type TranslateProps,
} from "../../hocs/translate.js";

export interface ExtensionShortNameProps {
	isPremiumEdition: boolean;
}

class ExtensionShortName<P extends ExtensionShortNameProps & TranslateProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			translateSync,
		} = this.props as P;

		// TODO: move resolving the name to the state, like edition type?
		const extensionShortName = isPremiumEdition
			? translateSync("extensionShortName_Premium")
			: translateSync("extensionShortName_Free");

		return extensionShortName;
	}
}

export default translateAttribute<ExtensionShortNameProps & TranslateProps>()(
	ExtensionShortName,
);
