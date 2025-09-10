/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type {
	OsType,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import type {
	ChildrenOptionalProps,
	OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";

import Discretional from "@talkie/shared-ui/components/discretional.js";
import Icon from "@talkie/shared-ui/components/icon/icon.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import InstallVoicesFaq from "./support/install-voices-faq.js";
import SupportEntryWithOptionalId from "./support/support-entry.js";

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
		} = this.props as P;

		// NOTE: aliased the SupportEntry element to minimize the diff.
		// TODO: unalias element to match original name SupportEntry.
		// eslint-disable-next-line react/function-component-definition, @typescript-eslint/prefer-readonly-parameter-types
		const SupportEntry: React.FC<{id: number} & ChildrenOptionalProps> = ({
			id,
			children = null,
		}) => (
			<SupportEntryWithOptionalId
				id={id}
				showAdditionalDetails={showAdditionalDetails}
			>
				{children}
			</SupportEntryWithOptionalId>
		);

		return (
			<>
				<textBase.h1>
					{translateSync("frontend_supportLinkText")}
				</textBase.h1>

				<section>
					<textBase.h2>
						{translateSync("frontend_faqHeading")}
					</textBase.h2>

					<p>
						{translateSync("frontend_supportDescription")}
					</p>

					<textBase.h3>
						{translateSync("frontend_faqVoicesHeading")}
					</textBase.h3>

					<SupportEntry id={1}>
						<listBase.ul>
							<listBase.li>
								<a
									href="https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/"
									lang="en"
								>
									Speech synthesizer live demo by Mozilla Developer Network (MDN)
								</a>
							</listBase.li>
						</listBase.ul>
					</SupportEntry>

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
						<SupportEntry id={34}>
							<listBase.ul>
								<listBase.li>
									<Icon
										className="icon-wikipedia-w"
										mode="inline"
									/>
									{" "}
									<a
										href="https://en.wikipedia.org/wiki/Microsoft_Speech_API"
										lang="en"
									>
										Speech Application Programming Interface (SAPI)
									</a>
								</listBase.li>
								<listBase.li>
									<Icon
										className="icon-wikipedia-w"
										mode="inline"
									/>
									{" "}
									<a
										href="https://en.wikipedia.org/wiki/Microsoft_text-to-speech_voices"
										lang="en"
									>
										Microsoft text-to-speech voices
									</a>
								</listBase.li>
							</listBase.ul>
						</SupportEntry>

						<SupportEntry id={35}>
							<listBase.ul>
								<listBase.li>
									Stack Exchange:
									{" "}
									<a
										href="https://stackoverflow.com/questions/40406719/windows-10-tts-voices-not-showing-up"
										lang="en"
									>
										Windows 10 TTS voices not showing up?
									</a>
									{" "}
									at Stack Overflow.
								</listBase.li>
							</listBase.ul>
						</SupportEntry>
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
						<SupportEntry id={17}>
							<listBase.ul>
								<listBase.li>
									<a
										href={configure("shared.urls.external.shortcut-keys")}
										// NOTE: only handle the click in Chrome, as the feature can't be used in Firefox.
										onClick={systemType === "chrome" ? this.handleOpenShortKeysConfigurationClick : undefined}
									>
										{translateSync("frontend_usageShortcutKeyAlternative05")}
									</a>
								</listBase.li>
							</listBase.ul>
						</SupportEntry>
					</Discretional>

					<Discretional
						enabled={showAdditionalDetails || systemType === "webextension"}
					>
						<SupportEntry id={18}>
							<listBase.ul>
								<listBase.li>
									<a
										href={configure("webextension.urls.external.shortcut-keys")}
									>
										{translateSync("frontend_usageShortcutKeyAlternative05")}
									</a>
								</listBase.li>
							</listBase.ul>
						</SupportEntry>
					</Discretional>

					<SupportEntry id={41}/>
					<SupportEntry id={42}/>
					<SupportEntry id={43}/>
					<SupportEntry id={19}/>
					<SupportEntry id={20}/>
					<SupportEntry id={25}/>

					<textBase.h3>
						{translateSync("frontend_faqTalkiePremiumHeading")}
					</textBase.h3>

					<SupportEntry id={21}/>
					<SupportEntry id={33}/>
					<SupportEntry id={24}/>
					<SupportEntry id={37}/>
					<SupportEntry id={29}/>
					<SupportEntry id={26}/>
					<SupportEntry id={27}/>
					<SupportEntry id={28}/>
					<SupportEntry id={40}/>
					<SupportEntry id={39}/>
					<SupportEntry id={38}/>
					<SupportEntry id={22}/>
					<SupportEntry id={23}/>
					<SupportEntry id={31}/>
					<SupportEntry id={32}/>

					<textBase.h3>
						{translateSync("frontend_faqBugsHeading")}
					</textBase.h3>

					<SupportEntry id={10}/>
					<SupportEntry id={11}/>
					<SupportEntry id={12}/>
					<SupportEntry id={13}/>
				</section>

				<section>
					<textBase.h2>
						{translateSync("frontend_supportLinksHeading")}
					</textBase.h2>

					<listBase.ul>
						<listBase.li>
							<a href={configure("urls.external.project")}>
								{translateSync("frontend_aboutProjectPageLinkText")}
							</a>
						</listBase.li>
						<listBase.li>
							<a href={configure("urls.external.github")}>
								{translateSync("frontend_aboutCodeOnGithubLinkText")}
							</a>
						</listBase.li>
						<listBase.li>
							<a href={configure("urls.external.github-issues")}>
								{translateSync("frontend_aboutIssuesOnGithubLinkText")}
							</a>
						</listBase.li>
						<listBase.li>
							<a href={configure("urls.external.support-feedback")}>
								{translateSync("frontend_supportAndFeedback")}
							</a>
						</listBase.li>
						<listBase.li>
							<a href={configure("urls.external.rate")}>
								{translateSync("frontend_rateIt")}
							</a>
						</listBase.li>
					</listBase.ul>
				</section>
			</>
		);
	}
}

export default configureAttribute<SupportProps & ConfigureProps>()(
	translateAttribute<SupportProps & ConfigureProps & TranslateProps>()(
		Support,
	),
);

