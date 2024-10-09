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
GNU General Public License for more stacktrace.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import React, {
	type ErrorInfo,
} from "react";
import type {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";

import {
	type ChildrenRequiredProps,
} from "../types.mjs";

interface ErrorBoundaryState {
	componentStack: string | null;
	hasError: boolean;
	message: string | null;
	stacktrace: string | null;
}

export default class ErrorBoundary<P extends ChildrenRequiredProps> extends React.PureComponent<P, ErrorBoundaryState> {
	static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
		// NOTE: React doesn't enforce the Error type; it's merely best practice to throw Error objects (as opposed to "anything").
		const errorObject = error instanceof Error
			? error
			: null;

		return {
			hasError: true,
			message: errorObject?.message ?? JSON.stringify(error) ?? null,
			stacktrace: errorObject?.stack?.toString() ?? null,
		};
	}

	override state: ErrorBoundaryState = {
		componentStack: null,
		hasError: false,
		message: null,
		stacktrace: null,
	};

	override componentDidCatch(error: unknown, info: ReadonlyDeep<ErrorInfo>): void {
		// TODO: use DualLogger?
		// eslint-disable-next-line no-console
		console.error("ErrorBoundary", error, info);

		this.setState({
			componentStack: info ? info.componentStack ?? null : null,
		});
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	prettyPrintForEmailBody(value: JsonValue, limit: number): string {
		const string = value ? String(value) : JSON.stringify(value);
		let pretty = string
			.trim()
			.replaceAll("\n", "\n> ");

		if (pretty.length > limit) {
			pretty = pretty.slice(0, Math.max(0, limit)) + "...";
		}

		return pretty;
	}

	override render(): React.ReactNode {
		if (this.state.hasError) {
			// TODO: add some version, build, and browser details to the error message.
			const recipient = "code@joelpurra.com";
			const subject = "Something went wrong in Talkie";
			const body = this._getBodyText();
			const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

			const messageElement = this.state.message
				? (
					<blockquote>
						<pre>
							{this.state.message}
						</pre>
					</blockquote>
				)
				: null;

			const componentStackElement = this.state.componentStack
				? (
					<details>
						<summary>
							Component stack
						</summary>

						<blockquote>
							<pre>
								{this.state.componentStack}
							</pre>
						</blockquote>
					</details>
				)
				: null;

			const stackTraceElement = this.state.stacktrace
				? (
					<details>
						<summary>
							Error stack trace
						</summary>

						<blockquote>
							<pre>
								{this.state.stacktrace}
							</pre>
						</blockquote>
					</details>
				)
				: null;

			// TODO: could avoid avoiding using a HOC or similar?
			return (
				<div>
					<hr/>

					<h1>
						Something went wrong
					</h1>

					<p>
						Sorry! This really should not happen. If you would like, email me an error report using the link below, and I will try to fix it for
						{" "}
						<a href="https://joelpurra.com/projects/talkie/">
							the next version of Talkie
							{/* eslint-disable-next-line react/jsx-child-element-spacing */}
						</a>
						!
					</p>

					<p>
						&mdash;
						{" "}
						<a
							href="https://joelpurra.com/"
							lang="en"
							rel="noopener noreferrer"
							target="_blank"
						>
							Joel Purra
						</a>
					</p>

					<hr/>

					<p>
						Talkie
					</p>

					{messageElement}

					<p>
						<a
							href={mailto}
							rel="noopener noreferrer"
							target="_blank"
						>
							Email error report to
							{" "}
							{recipient}
						</a>
					</p>

					{componentStackElement}

					{stackTraceElement}
				</div>
			);
		}

		return this.props.children;
	}

	private _getBodyText(): string {
		return `Hello Joel,

Something went wrong while using Talkie! This is my error report — can you please have a look at it?

(Optional) My description of the problem is:



Below are some technical details.

Talkie
https://joelpurra.com/projects/talkie/


Error message:

> ${this.prettyPrintForEmailBody(this.state.message, 128)}


Component stack:

> ${this.prettyPrintForEmailBody(this.state.componentStack, 128)}


Error stack trace:

> ${this.prettyPrintForEmailBody(this.state.stacktrace, 512)}



Hope this helps =)

`;
	}
}
