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

import SharingIcons from "@talkie/shared-application/components/sharing/sharing-icons";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as textBase from "@talkie/shared-application/styled/text/text-base";
import React, {
	ComponentProps,
} from "react";
import {
	styled,
	StyletronComponent,
} from "styletron-react";

class About<P extends ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	private readonly styled: {
		sharingIcons: StyletronComponent<ComponentProps<typeof SharingIcons>>;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			sharingIcons: styled(
				SharingIcons,
				{
					display: "inline-block",
					verticalAlign: "middle",
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			translateSync,
			configure,
		} = this.props;

		return (
			<section>
				<textBase.h2>
					{translateSync("frontend_storyHeading")}
				</textBase.h2>
				<textBase.p>
					{translateSync("frontend_storyDescription")}
				</textBase.p>
				<textBase.p>
					{translateSync("frontend_storyThankYou")}
				</textBase.p>
				<textBase.p>
					—
					<textBase.a
						href="https://joelpurra.com/"
						lang="sv"
					>
						Joel Purra
					</textBase.a>
				</textBase.p>

				<textBase.h2>
					{translateSync("frontend_shareHeading")}
				</textBase.h2>

				<textBase.p>
					{translateSync("frontend_sharePitch", [
						translateSync("extensionShortName"),
					])}
				</textBase.p>

				<div>
					<this.styled.sharingIcons/>

					<textBase.a href={configure("urls.rate")}>
						{translateSync("frontend_rateIt")}
					</textBase.a>
				</div>
			</section>
		);
	}
}

export default translateAttribute()(
	configureAttribute<ConfigureProps & TranslateProps>()(
		About,
	),
);

