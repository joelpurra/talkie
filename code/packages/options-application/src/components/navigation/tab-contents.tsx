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

import {
	ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import {
	BubbledLinkClickHandler,
	handleBubbledLinkClick,
} from "@talkie/shared-ui/utils/ui.mjs";
import React from "react";
import type {
	ReadonlyDeep,
} from "type-fest";

export interface TabContentsProps {
	activeTabId: string | null;
	id: string;
	onLinkClick: BubbledLinkClickHandler;
}

export default class TabContents<P extends TabContentsProps & ChildrenRequiredProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleClick(event: Readonly<React.MouseEvent>): false | undefined {
		// TODO: use an api call which has handleBubbledLinkClick?
		return handleBubbledLinkClick(this.props.onLinkClick, event as ReadonlyDeep<React.MouseEvent>);
	}

	override render(): React.ReactNode {
		if (this.props.id !== this.props.activeTabId) {
			return null;
		}

		return (
			<div
				id={this.props.id}
				onClick={this.handleClick}
			>
				{this.props.children}
			</div>
		);
	}
}
