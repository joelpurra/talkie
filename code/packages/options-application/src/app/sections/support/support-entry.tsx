/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type {
	ChildrenOptionalProps,
} from "@talkie/shared-ui/types.mjs";

import Discretional from "@talkie/shared-ui/components/discretional.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

interface SupportEntryProps {
	id: number;
	showAdditionalDetails: boolean;
}

class SupportEntry<P extends SupportEntryProps & ChildrenOptionalProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		showAdditionalDetails: false,
	};

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			children,
			id,
			showAdditionalDetails,
			translateSync,
		} = this.props as P;

		const paddedId = id.toString(10).padStart(3, "0");

		return (
			<layoutBase.details>
				<layoutBase.summary>
					<textBase.summaryHeading4>
						<Discretional
							enabled={showAdditionalDetails}
						>
							<span
								dir="ltr"
								lang="en"
							>
								FAQ&nbsp;
								{id}
							</span>
							:
							{" "}
						</Discretional>

						<span>
							{translateSync(`frontend_faq${paddedId}Q`)}
						</span>
					</textBase.summaryHeading4>
				</layoutBase.summary>
				<p>
					{translateSync(`frontend_faq${paddedId}A`)}
				</p>

				{children}
			</layoutBase.details>
		);
	}
}

export default translateAttribute<SupportEntryProps & ChildrenOptionalProps & TranslateProps>()(
	SupportEntry,
);

