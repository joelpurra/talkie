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
	type SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	type OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

import InstallVoicesFaq from "./support/install-voices-faq.js";
import SupportEntry from "./support/support-entry.js";

export interface SupportProps {
	onOpenShortKeysConfigurationClick: OnOpenShortcutKeysClickProp;
	osType?: OsType | null;
	showAdditionalDetails: boolean;
	systemType: SystemType | null;
}

class Support<P extends SupportProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		osType: null,
	};

	constructor(props: P) {
		super(props);

		this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOpenShortKeysConfigurationClick(event: React.MouseEvent): false {
		// NOTE: only handle the click in Chrome, as the feature can't be used in Firefox.
		return this.props.onOpenShortKeysConfigurationClick(event);
	}

	override render(): React.ReactNode {
		const {
			configure,
			osType,
			showAdditionalDetails,
			systemType,
			translateSync,
		} = this.props;

		return (
			<section>
				<textBase.h2>
					{translateSync("frontend_faqHeading")}
				</textBase.h2>

				<textBase.p>
					{translateSync("frontend_supportDescription", [
						translateSync("extensionShortName"),
					])}
				</textBase.p>

				<textBase.h3>
					{translateSync("frontend_faqVoicesHeading")}
				</textBase.h3>

				<SupportEntry id={1}/>
				<SupportEntry id={9}/>

				<InstallVoicesFaq
					osType={osType}
					showAdditionalDetails={showAdditionalDetails}
				/>

				<SupportEntry id={6}/>
				<SupportEntry id={7}/>
				<SupportEntry id={8}/>

				<Discretional
					enabled={showAdditionalDetails || osType === "win"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<textBase.summaryHeading4>
								{translateSync("frontend_faq034Q")}
							</textBase.summaryHeading4>
						</layoutBase.summary>
						<textBase.p>
							{translateSync("frontend_faq034A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://en.wikipedia.org/wiki/Microsoft_Speech_API"
									lang="en"
								>
									Speech Application Programming Interface (SAPI)
								</textBase.a>
							</listBase.li>
							<listBase.li>
								<textBase.a
									href="https://en.wikipedia.org/wiki/Microsoft_text-to-speech_voices"
									lang="en"
								>
									Microsoft text-to-speech voices
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>

					<layoutBase.details>
						<layoutBase.summary>
							<textBase.summaryHeading4>
								{translateSync("frontend_faq035Q")}
							</textBase.summaryHeading4>
						</layoutBase.summary>
						<textBase.p>
							{translateSync("frontend_faq035A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://stackoverflow.com/questions/40406719/windows-10-tts-voices-not-showing-up"
									lang="en"
								>
									StackOverflow: Windows 10 TTS voices not showing up?
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<SupportEntry id={36}/>

				<textBase.h3>
					{translateSync("frontend_faqGeneralHeading")}
				</textBase.h3>

				<SupportEntry id={14}/>
				<SupportEntry id={15}/>
				<SupportEntry id={16}/>

				<Discretional
					enabled={showAdditionalDetails || systemType === "chrome"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<textBase.summaryHeading4>
								{translateSync("frontend_faq017Q")}
							</textBase.summaryHeading4>
						</layoutBase.summary>
						<textBase.p>
							{translateSync("frontend_faq017A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href={configure("shared.urls.external.shortcut-keys")}
									// NOTE: only handle the click in Chrome, as the feature can't be used in Firefox.
									onClick={systemType === "chrome" ? this.handleOpenShortKeysConfigurationClick : undefined}
								>
									{translateSync("frontend_usageShortcutKeyAlternative05")}
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={showAdditionalDetails || systemType === "webextension"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<textBase.summaryHeading4>
								{translateSync("frontend_faq018Q")}
							</textBase.summaryHeading4>
						</layoutBase.summary>
						<textBase.p>
							{translateSync("frontend_faq018A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href={configure("webextension.urls.external.shortcut-keys")}
								>
									{translateSync("frontend_usageShortcutKeyAlternative05")}
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<SupportEntry id={19}/>
				<SupportEntry id={20}/>
				<SupportEntry id={25}/>

				<textBase.h3>
					{translateSync("frontend_faqTalkiePremiumHeading")}
				</textBase.h3>

				<SupportEntry id={21}/>
				<SupportEntry id={33}/>
				<SupportEntry id={24}/>
				<SupportEntry id={22}/>
				<SupportEntry id={23}/>
				<SupportEntry id={26}/>
				<SupportEntry id={27}/>
				<SupportEntry id={28}/>
				<SupportEntry id={29}/>
				<SupportEntry id={30}/>
				<SupportEntry id={31}/>
				<SupportEntry id={32}/>

				<textBase.h3>
					{translateSync("frontend_faqBugsHeading")}
				</textBase.h3>

				<SupportEntry id={10}/>
				<SupportEntry id={11}/>
				<SupportEntry id={12}/>
				<SupportEntry id={13}/>

				<textBase.h2>
					{translateSync("frontend_supportLinksHeading")}
				</textBase.h2>

				<listBase.ul>
					<listBase.li>
						<textBase.a href={configure("urls.external.project")}>
							{translateSync("frontend_aboutProjectPageLinkText")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a href={configure("urls.external.github")}>
							{translateSync("frontend_aboutCodeOnGithubLinkText")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a href={configure("urls.external.github-issues")}>
							{translateSync("frontend_aboutIssuesOnGithubLinkText")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a href={configure("urls.external.support-feedback")}>
							{translateSync("frontend_supportAndFeedback")}
						</textBase.a>
					</listBase.li>
					<listBase.li>
						<textBase.a href={configure("urls.external.rate")}>
							{translateSync("frontend_rateIt")}
						</textBase.a>
					</listBase.li>
				</listBase.ul>
			</section>
		);
	}
}

export default configureAttribute<SupportProps & ConfigureProps>()(
	translateAttribute<SupportProps & ConfigureProps & TranslateProps>()(
		Support,
	),
);

