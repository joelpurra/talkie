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

import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as tableBase from "@talkie/shared-ui/styled/table/table-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import * as colorBase from "@talkie/shared-ui/styles/color/color-base.mjs";
import {
	TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import React from "react";
import {
	withStyleDeep,
} from "styletron-react";

import {
	NavLink,
} from "./nav-container-types.mjs";
import {
	getLocationHashFromTabId,
	getTabIdFromLocationHash,
	isLocationHash,
} from "./nav-helpers.mjs";

export interface NavProps {
	initialActiveTabId: string | null;
	links: NavLink[];
	onTabChange: (tabId: string) => void;
}

export default class Nav<P extends NavProps> extends React.PureComponent<P> {
	private readonly styled: {
		nav: TalkieStyletronComponent<typeof layoutBase.nav>;
		navTable: TalkieStyletronComponent<typeof tableBase.wideTable>;
		navTableTd: TalkieStyletronComponent<typeof tableBase.td>;
		selectedLink: TalkieStyletronComponent<typeof textBase.a>;
	};

	constructor(props: P) {
		super(props);

		this.handleClick = this.handleClick.bind(this);

		this.styled = {
			nav: withStyleDeep(
				layoutBase.nav,
				{
					lineHeight: "1.5em",
					textAlign: "center",
				},
			),

			navTable: withStyleDeep(
				tableBase.wideTable,
				{
					lineHeight: "1.5em",
					textAlign: "center",
				},
			),

			navTableTd: withStyleDeep(
				tableBase.td,
				{
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					marginTop: 0,
					paddingBottom: 0,
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: 0,
				},
			),

			selectedLink: withStyleDeep(
				textBase.a,
				{
					color: colorBase.linkFocusColor,
					fontWeight: "bold",
				},
			),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleClick(event: Readonly<React.MouseEvent<HTMLTableCellElement>>): false | undefined {
		const anchor = event.target as HTMLTableCellElement;

		if (anchor.tagName === "A") {
			const href = anchor.getAttribute("href");

			if (isLocationHash(href)) {
				const tabId = getTabIdFromLocationHash(href);

				event.preventDefault();
				event.stopPropagation();

				this.props.onTabChange(tabId);

				return false;
			}

			// TODO: warn about mismatched link element type?
		}

		return undefined;
	}

	override render(): React.ReactNode {
		const {
			links,
			initialActiveTabId,
		} = this.props as NavProps;

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const linkCells = links.map((link) => {
			let resolvedUrl: string | null = null;

			if (typeof link.tabId === "string" && link.url instanceof URL) {
				throw new TypeError(`Has both a link and a tab id: ${JSON.stringify(link)}`);
			} else if (typeof link.tabId === "string") {
				resolvedUrl = getLocationHashFromTabId(link.tabId);
			} else if (link.url instanceof URL) {
				resolvedUrl = link.url.toString();
			} else {
				throw new TypeError(`Need either a link or a tab id: ${JSON.stringify(link)}`);
			}

			const SelectedLinkType = initialActiveTabId === link.tabId
				? this.styled.selectedLink
				: textBase.a;

			return (
				<this.styled.navTableTd
					key={resolvedUrl}
					onClick={this.handleClick}
				>
					<SelectedLinkType
						href={resolvedUrl}
					>
						{link.text}
					</SelectedLinkType>
				</this.styled.navTableTd>
			);
		});

		// const colCount = linkCells.length;
		const colWidth = `${100 / linkCells.length}%`;

		return (
			<this.styled.nav className="columns">
				<this.styled.navTable>
					<colgroup>
						<col width={colWidth}/>
					</colgroup>
					<tableBase.tbody>
						<tableBase.tr>
							{linkCells}
						</tableBase.tr>
					</tableBase.tbody>
				</this.styled.navTable>
			</this.styled.nav>
		);
	}
}
