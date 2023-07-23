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

import Discretional from "@talkie/shared-ui/components/discretional.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import {
	type ClassNameProp,
} from "@talkie/shared-ui/styled/types.js";
import {
	type ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

export interface DiscretionalDetailsProps extends ChildrenRequiredProps, ClassNameProp {
	open: boolean;

	/**
	 * Minimal toggle event callback. Only applies to the current details tag, not child detail elements.
	 */
	onToggle?: (isOpen: boolean) => void;

	// TODO: narrow to phrasing/heading content?
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
	summary?: string | null;

	// TODO: narrow to a single summary element?
	summaryElement?: React.ReactNode;
}

export default class DiscretionalDetails<P extends DiscretionalDetailsProps> extends React.PureComponent<P> {
	wrappedDetailsRef: React.RefObject<HTMLDetailsElement>;

	constructor(props: P) {
		super(props);

		this.wrappedDetailsRef = React.createRef();
		this.handleOnToggle = this.handleOnToggle.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOnToggle(event: React.SyntheticEvent<HTMLDetailsElement>): void {
		const {
			current,
		} = this.wrappedDetailsRef;

		if (current === event.target) {
			const {
				onToggle,
			} = this.props;

			if (typeof onToggle === "function") {
				// NOTE: the toggle event happens _after_ the details element has been toggled.
				// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#events
				onToggle(current.open);
			}
		}
	}

	override render(): React.ReactNode {
		const {
			children,
			className,
			open,
			summary,
			summaryElement,
		} = this.props as DiscretionalDetailsProps;

		if (summary && summaryElement) {
			throw new TypeError("summary && summaryElement");
		}

		const dynamicSummaryElement: React.ReactNode = summaryElement
			? summaryElement
			: (
				<summary>
					{summary}
				</summary>
			);

		return (
			<layoutBase.details
				ref={this.wrappedDetailsRef}
				className={className}
				open={open}
				onToggle={this.handleOnToggle}
			>
				{dynamicSummaryElement}

				<Discretional
					enabled={open}
				>
					{children}
				</Discretional>
			</layoutBase.details>
		);
	}
}
