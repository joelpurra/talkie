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

import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import React from "react";

class Menu<P extends ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			configure,
			translateSync,
		} = this.props as P;

		return (
			<layoutBase.nav>
				<ul>
					<li>
						<a href={configure("urls.internal.options-status")} rel="noopener noreferrer" target="_blank">
							{translateSync("frontend_PopupMenu_Status")}
						</a>
					</li>
					<li>
						<a href={configure("urls.internal.options-voices")} rel="noopener noreferrer" target="_blank">
							{translateSync("frontend_PopupMenu_Voices")}
						</a>
					</li>
					<li>
						<a href={configure("urls.internal.options-usage")} rel="noopener noreferrer" target="_blank">
							{translateSync("frontend_PopupMenu_Usage")}
						</a>
					</li>
					<li>
						<a href={configure("urls.internal.options-features")} rel="noopener noreferrer" target="_blank">
							{translateSync("frontend_PopupMenu_Features")}
						</a>
					</li>
					<li>
						<a href={configure("urls.internal.options-support")} rel="noopener noreferrer" target="_blank">
							{translateSync("frontend_supportAndFeedback")}
						</a>
					</li>
				</ul>
			</layoutBase.nav>
		);
	}
}

export default configureAttribute()(
	translateAttribute<ConfigureProps & TranslateProps>()(
		Menu,
	),
);

