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

import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	ClassNameProp,
} from "@talkie/shared-ui/styled/types.js";
import SocialShareIcon from "@talkie/shared-ui/components/icon/social-share-icon.js";

class SharingIcons<P extends ConfigureProps & ClassNameProp> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			className,
			configure,
		} = this.props;

		return (
			<listBase.inlineUl className={className}>
				<listBase.inlineLi>
					<textBase.a href={configure("urls.share.twitter")}>
						<SocialShareIcon
							mode="standalone"
							network="twitter"
							size="2em"
						/>
					</textBase.a>
				</listBase.inlineLi>
				<listBase.inlineLi>
					<textBase.a href={configure("urls.share.facebook")}>
						<SocialShareIcon
							mode="standalone"
							network="facebook"
							size="2em"
						/>
					</textBase.a>
				</listBase.inlineLi>
				<listBase.inlineLi>
					<textBase.a href={configure("urls.share.googleplus")}>
						<SocialShareIcon
							mode="standalone"
							network="googleplus"
							size="2em"
						/>
					</textBase.a>
				</listBase.inlineLi>
				<listBase.inlineLi>
					<textBase.a href={configure("urls.share.linkedin")}>
						<SocialShareIcon
							mode="standalone"
							network="linkedin"
							size="2em"
						/>
					</textBase.a>
				</listBase.inlineLi>
			</listBase.inlineUl>
		);
	}
}

export default configureAttribute<ConfigureProps & ClassNameProp>()(
	SharingIcons,
);
