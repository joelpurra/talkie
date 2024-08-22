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

import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	type ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContinueSpeechProps {}

class ContinueSpeech<P extends ContinueSpeechProps & ChildrenRequiredProps & TranslateProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			children,
			translatePlaceholderSync,
		} = this.props as P;

		return (
			<>
				<textBase.h2>
					{translatePlaceholderSync("Continue speaking or automatically stop" /* "frontend_voicesContinueOnTabHeading" */)}
				</textBase.h2>
				<p>
					{translatePlaceholderSync("Talkie can be used to read the selected text on a page. When the page is closed or the page address changes, Talkie can either continue speaking or automatically stop." /* "frontend_voicesContinueOnTabExplanation01" */)}
				</p>

				{children}
			</>
		);
	}
}

export default translateAttribute<ContinueSpeechProps & ChildrenRequiredProps & TranslateProps>()(
	ContinueSpeech,
);
