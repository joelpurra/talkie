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
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

import InstallVoicesFaq from "../support/install-voices-faq.js";

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

	standardFaqEntry(id: number): React.ReactNode {
		const {
			translateSync,
		} = this.props;

		const paddedId = id.toString(10).padStart(3, "0");

		return (
			<layoutBase.details>
				<layoutBase.summary>
					<textBase.summaryHeading4>
						{translateSync(`frontend_faq${paddedId}Q`)}
					</textBase.summaryHeading4>
				</layoutBase.summary>
				<textBase.p>
					{translateSync(`frontend_faq${paddedId}A`)}
				</textBase.p>
			</layoutBase.details>
		);
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

				{this.standardFaqEntry(1)}

				<InstallVoicesFaq
					osType={osType}
					showAdditionalDetails={showAdditionalDetails}
				/>

				{this.standardFaqEntry(6)}
				{this.standardFaqEntry(7)}
				{this.standardFaqEntry(8)}
				{this.standardFaqEntry(9)}

				<textBase.h3>
					{translateSync("frontend_faqGeneralHeading")}
				</textBase.h3>

				{this.standardFaqEntry(14)}
				{this.standardFaqEntry(15)}
				{this.standardFaqEntry(16)}

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
									{translateSync("frontend_usageShortcutKeyAlternative04")}
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
									{translateSync("frontend_usageShortcutKeyAlternative04")}
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				{this.standardFaqEntry(19)}
				{this.standardFaqEntry(20)}
				{this.standardFaqEntry(25)}

				<textBase.h3>
					{translateSync("frontend_faqTalkiePremiumHeading")}
				</textBase.h3>

				{this.standardFaqEntry(21)}
				{this.standardFaqEntry(33)}
				{this.standardFaqEntry(24)}
				{this.standardFaqEntry(22)}
				{this.standardFaqEntry(23)}
				{this.standardFaqEntry(26)}
				{this.standardFaqEntry(27)}
				{this.standardFaqEntry(28)}
				{this.standardFaqEntry(29)}
				{this.standardFaqEntry(30)}
				{this.standardFaqEntry(31)}
				{this.standardFaqEntry(32)}

				<textBase.h3>
					{translateSync("frontend_faqBugsHeading")}
				</textBase.h3>

				{this.standardFaqEntry(10)}
				{this.standardFaqEntry(11)}
				{this.standardFaqEntry(12)}
				{this.standardFaqEntry(13)}

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

