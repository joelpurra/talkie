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
	type ClassNameProp,
} from "@talkie/shared-ui/styled/types.js";
import React from "react";
import ReactMarkdown from "react-markdown";

export interface MarkdownProps extends ClassNameProp {
	children: string;
}

interface InternalProps extends MarkdownProps {}

class MarkdownParagraph<P extends InternalProps> extends React.PureComponent<P> {
	linkTarget: (...args: Readonly<unknown[]>) => never;
	transformImageUri: (...args: Readonly<unknown[]>) => never;
	transformLinkUri: (...args: Readonly<unknown[]>) => never;

	constructor(props: P) {
		super(props);

		this.linkTarget = this.alwaysThrow.bind(null, "linkTarget");
		this.transformImageUri = this.alwaysThrow.bind(null, "transformImageUri");
		this.transformLinkUri = this.alwaysThrow.bind(null, "transformLinkUri");
	}

	alwaysThrow(_callType: string, ...args: Readonly<unknown[]>): never {
		throw new Error(`Disallowed code in markdown: ${JSON.stringify([
			...args,
		])}`);
	}

	override render(): React.ReactNode {
		const {
			children,
			className,
		} = this.props as InternalProps;

		return (
			<ReactMarkdown
				skipHtml
				unwrapDisallowed
				allowedElements={[
					// TODO: expand element types if/when HTML is allowed.
					"p",
				]}
				className={className}
				linkTarget={this.linkTarget}
				transformImageUri={this.transformImageUri}
				transformLinkUri={this.transformLinkUri}
			>
				{children}
			</ReactMarkdown>
		);
	}
}

export default MarkdownParagraph;
