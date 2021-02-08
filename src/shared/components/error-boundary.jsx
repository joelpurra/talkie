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
GNU General Public License for more stacktrace.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import PropTypes from "prop-types";
import React from "react";

// NOTE: avoiding using a HOC or similar.
import ManifestProvider from "../../split-environments/manifest-provider";

export default class ErrorBoundary extends React.PureComponent {
	state = {
		componentStack: null,
		hasError: false,
		message: null,
		stacktrace: null,
	};

		static propTypes = {
			children: PropTypes.node.isRequired,
		}

		componentDidCatch(error, info) {
		// TODO: use DualLogger?
		/* eslint-disable no-console */
			console.error("ErrorBoundary", error, info);
			/* eslint-enable no-console */

			this.setState({
				componentStack: info.componentStack,
				hasError: true,
				message: error.message,
				stacktrace: error.stack && error.stack.toString(),
			});
		}

		prettyPrintForEmailBody(value, limit) {
			let pretty = null;

			if (value) {
				pretty = value
					.toString()
					.trim()
					.replace(/\n/g, "\n> ");

				if (pretty.length > limit) {
					pretty = pretty.slice(0, Math.max(0, limit)) + "...";
				}
			} else {
				pretty = value;
			}

			return pretty;
		}

		render() {
			if (this.state.hasError) {
				const manifestProvider = new ManifestProvider();
				/* eslint-disable no-sync */
				const manifest = manifestProvider.getSync();
				/* eslint-enable no-sync */

				const recipient = "code@joelpurra.com";
				const subject = "Something went wrong in Talkie";

				const body = `Hello Joel,

Something went wrong while using Talkie! This is my error report — can you please have a look at it?

(Optional) My description of the problem is:



Below are some technical details.

Talkie ${manifest.version_name}
https://joelpurra.com/projects/talkie/


Error message:

> ${this.prettyPrintForEmailBody(this.state.message, 128)}


Component stack:

> ${this.prettyPrintForEmailBody(this.state.componentStack, 128)}


Error stack trace:

> ${this.prettyPrintForEmailBody(this.state.stacktrace, 512)}



Hope this helps =)

`;
				const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

				return (
					<div>
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
							{" "}
							{manifest.version_name}
						</p>

						<blockquote>
							<pre>
								{this.state.message}
							</pre>
						</blockquote>

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
					</div>
				);
			}

			return this.props.children;
		}
}
