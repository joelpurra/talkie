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
	OsType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import translateAttribute, {
	TranslateProps,
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
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			osType,
			showAdditionalDetails,
			translateSync,
		} = this.props;

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
						<textBase.p>
							{translateSync("frontend_faq002A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3"
									lang="en"
								>
									Windows 10
								</textBase.a>
								: Settings &gt;&nbsp;Time&nbsp;&amp;&nbsp;Language &gt;&nbsp;Language
								{/* TODO: translate system settings path. */}
							</listBase.li>
							<listBase.li>
								<textBase.a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-4c83a8d8-7486-42f7-8e46-2b0fdf753130"
									lang="en"
								>
									Windows 8
								</textBase.a>
							</listBase.li>
							<listBase.li>
								<textBase.a
									href="https://www.microsoft.com/en-us/download/details.aspx?id=27224"
									lang="en"
								>
									Windows 7
								</textBase.a>
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
						<textBase.p>
							{translateSync("frontend_faq003A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://chrome.google.com/webstore/detail/us-english-female-text-to/pkidpnnapnfgjhfhkpmjpbckkbaodldb"
									lang="en"
								>
									US English Female Text-to-speech (by Google)
								</textBase.a>
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
						<textBase.p>
							{translateSync("frontend_faq004A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://support.apple.com/kb/index?page=search&amp;q=VoiceOver+language&amp;product=PF6&amp;doctype=PRODUCT_HELP,HOWTO_ARTICLES&amp;locale=en_US"
									lang="en"
								>
									macOS
								</textBase.a>
								: System&nbsp;Preferences &gt;&nbsp;Accessibility &gt;&nbsp;Speech &gt;&nbsp;System&nbsp;voice &gt;&nbsp;Customize...
								{/* TODO: translate system settings path. */}
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
						<textBase.p>
							{translateSync("frontend_faq005A")}
						</textBase.p>
					</layoutBase.details>
				</Discretional>
			</>
		);
	}

	static defaultProps = {
		osType: null,
	};
}

export default translateAttribute<InstallVoicesFaqProps & TranslateProps>()(
	InstallVoicesFaq,
);

