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
	type RejectedAction,
} from "@talkie/shared-ui/slices/errors.mjs";
import * as errorBase from "@talkie/shared-ui/styled/layout/error-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import React from "react";
import {
	withStyleDeep,
} from "styletron-react";

export interface CollectedErrorListStateProps {
	errorCount: number;
	errorList: Readonly<RejectedAction[]>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CollectedErrorListDispatchProps {}

interface CollectedErrorListProps extends CollectedErrorListStateProps, CollectedErrorListDispatchProps {}

export default class CollectedErrorList<P extends CollectedErrorListProps> extends React.PureComponent<P> {
	private readonly styled: {
		firstChildH2: TalkieStyletronComponent<typeof textBase.h2>;
		lastChildOL: TalkieStyletronComponent<typeof listBase.ol>;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			firstChildH2: withStyleDeep(
				textBase.h2,
				{
					marginTop: 0,
				},
			),

			lastChildOL: withStyleDeep(
				listBase.ol,
				{
					marginBottom: 0,
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			errorCount,
			errorList,
		} = this.props;

		return (
			<errorBase.section>
				{/* TODO: re-use error formatting from the react error handler component? */}
				<this.styled.firstChildH2>
					Problems encountered
				</this.styled.firstChildH2>
				<p>
					Collected details of
					{" "}
					{errorCount}
					{" "}
					error
					{errorCount === 1 ? "" : "s"}
					{" "}
					which occurred while displaying this page. This may have affected the functionality of Talkie. Sorry about that.
				</p>
				<p>
					{/* TODO: autogenerate an email link. */}
					Sometimes merely reloading the page helps. If that does not help, please aid the developer by reporting the error details.
				</p>

				<textBase.h3>
					Error details (
					{errorCount}
					)
				</textBase.h3>

				<this.styled.lastChildOL>
					{
						/* eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types */
						errorList.map((error) => (
							<li key={error.meta.requestId}>
								<pre>
									{/* TODO: format known keys in the error output? */}
									{/* TODO: render the stack trace with newlines? */}
									{JSON.stringify(error, undefined, 2)}
								</pre>
							</li>
						))
					}
				</this.styled.lastChildOL>
			</errorBase.section>
		);
	}
}
