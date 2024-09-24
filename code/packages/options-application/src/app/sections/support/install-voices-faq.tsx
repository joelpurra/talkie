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
	type OsType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

export interface InstallVoicesFaqProps {
	osType?: OsType | null;
	showAdditionalDetails: boolean;
}

class InstallVoicesFaq<P extends InstallVoicesFaqProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		osType: null,
	};

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			osType,
			showAdditionalDetails,
			translateSync,
		} = this.props as P;

		// TODO: translate system settings paths.

		return (
			<>
				<Discretional
					enabled={showAdditionalDetails || osType === "win"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<textBase.summaryHeading4>
								{translateSync("frontend_faq002Q")}
							</textBase.summaryHeading4>
						</layoutBase.summary>
						<p>
							{translateSync("frontend_faq002A")}
						</p>

						<listBase.ul>
							<listBase.li>
								<a
									href="https://support.microsoft.com/en-us/windows/appendix-a-supported-languages-and-voices-4486e345-7730-53da-fcfe-55cc64300f01"
									lang="en"
								>
									Windows 11
								</a>
								:
								{" "}
								Settings &rarr;&nbsp;Time&nbsp;&amp;&nbsp;Language &rarr;&nbsp;Language&nbsp;&amp;&nbsp;Region &rarr;&nbsp;Add&nbsp;a&nbsp;language
							</listBase.li>
							<listBase.li>
								<a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3"
									lang="en"
								>
									Windows 10
								</a>
								:
								{" "}
								Settings &rarr;&nbsp;Time&nbsp;&amp;&nbsp;Language &rarr;&nbsp;Language &rarr;&nbsp;Add&nbsp;a&nbsp;language
							</listBase.li>
							<listBase.li>
								<a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-4c83a8d8-7486-42f7-8e46-2b0fdf753130"
									lang="en"
								>
									Windows 8
								</a>
								:
								{" "}
								Control&nbsp;Panel &rarr;&nbsp;Language &rarr;&nbsp;Add&nbsp;a&nbsp;Language
							</listBase.li>
							<listBase.li>
								<a
									href="https://www.microsoft.com/en-us/download/details.aspx?id=27224"
									lang="en"
								>
									Windows 7
								</a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={showAdditionalDetails || osType === "cros"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<textBase.summaryHeading4>
								{translateSync("frontend_faq003Q")}
							</textBase.summaryHeading4>
						</layoutBase.summary>
						<p>
							{translateSync("frontend_faq003A")}
						</p>

						<listBase.ul>
							<listBase.li>
								<a
									href="https://support.google.com/accessibility/answer/11221616"
									lang="en"
								>
									ChromeOS
								</a>
								:
								{" "}
								Settings &rarr;&nbsp;Accessibility &rarr;&nbsp;Text-to-Speech &rarr;&nbsp;Speech&nbsp;Engines
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={showAdditionalDetails || osType === "mac"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<textBase.summaryHeading4>
								{translateSync("frontend_faq004Q")}
							</textBase.summaryHeading4>
						</layoutBase.summary>
						<p>
							{translateSync("frontend_faq004A")}
						</p>

						<listBase.ul>
							<listBase.li>
								<a
									href="https://support.apple.com/kb/index?page=search&amp;q=voiceover&amp;includeArchived=true&amp;locale=en_US"
									lang="en"
								>
									macOS
								</a>
								:
								{" "}
								System&nbsp;Settings &rarr;&nbsp;Accessibility &rarr;&nbsp;Spoken&nbsp;Content &rarr;&nbsp;System&nbsp;voice
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={showAdditionalDetails || osType === "linux"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<textBase.summaryHeading4>
								{translateSync("frontend_faq005Q")}
							</textBase.summaryHeading4>
						</layoutBase.summary>
						<p>
							{translateSync("frontend_faq005A")}
						</p>

						<listBase.ul>
							<listBase.li>
								Stack Exchange:
								{" "}
								<a
									href="https://unix.stackexchange.com/questions/tagged/text-to-speech"
									lang="en"
								>
									Questions tagged [text-to-speech]
								</a>
								{" "}
								(Unix &amp; Linux).
							</listBase.li>
							<listBase.li>
								Stack Exchange:
								{" "}
								<a
									href="https://askubuntu.com/questions/tagged/text-to-speech"
									lang="en"
								>
									Questions tagged [text-to-speech]
								</a>
								{" "}
								(Ask Ubuntu).
							</listBase.li>
							<listBase.li>
								Stack Exchange:
								{" "}
								<a
									href="https://softwarerecs.stackexchange.com/questions/tagged/speech-synthesis"
									lang="en"
								>
									Questions tagged [speech-synthesis]
								</a>
								{" "}
								(Software Recommendations).
							</listBase.li>
							<listBase.li>
								Stack Exchange:
								{" "}
								<a
									href="https://askubuntu.com/questions/953509/how-can-i-change-the-voice-used-by-firefox-reader-view-narrator-in-ubuntu"
									lang="en"
								>
									How can I change the voice used by Firefox in Ubuntu?
								</a>
								{" "}
								(Ask Ubuntu).
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>
			</>
		);
	}
}

export default translateAttribute<InstallVoicesFaqProps & TranslateProps>()(
	InstallVoicesFaq,
);

