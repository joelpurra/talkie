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
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import Loading from "../../../components/loading.js";
import Markdown from "../../../components/markdown.js";
import InstallVoicesFaq from "./install-voices-faq.js";

interface InstallVoicesState {
	hasWaitedLongEnoughForVoicesToLoad: boolean;
}

export interface InstallVoicesProps {
	haveVoices: boolean;
	languageGroupsCount: number;
	languagesCount: number;
	osType?: OsType | null;
	systemType: SystemType | null;
	voicesCount: number;
}

class InstallVoices<P extends InstallVoicesProps & TranslateProps> extends React.PureComponent<P, InstallVoicesState> {
	static defaultProps = {
		osType: null,
		sampleText: null,
		sampleTextLanguageCode: null,
	};

	override state = {
		hasWaitedLongEnoughForVoicesToLoad: false,
	};

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidMount() {
		setTimeout(
			() => {
				this.setState({
					hasWaitedLongEnoughForVoicesToLoad: true,
				});
			},
			5000,
		);
	}

	override render(): React.ReactNode {
		const {
			haveVoices,
			languageGroupsCount,
			languagesCount,
			osType,
			systemType,
			translateSync,
			voicesCount,
		} = this.props;

		// NOTE: don't show additional details on the welcome page.
		const showAdditionalDetails = false;

		const moreVoicesCountsMarkdown = translateSync("frontend_welcomeInstallMoreVoicesDescription", [
			`**${voicesCount.toString(10)}**`,
			`**${languageGroupsCount.toString(10)}**`,
			`**${languagesCount.toString(10)}**`,

			// TODO: translated fallback.
			systemType ?? "(ERROR: unknown system type)",

			// TODO: translated fallback.
			osType ?? "(ERROR: unknown operating system)",
		]);

		return (
			<section>
				<Discretional
					enabled={haveVoices || !this.state.hasWaitedLongEnoughForVoicesToLoad}
				>
					<Loading
						isBlockElement
						enabled={haveVoices}
					>
						<textBase.p>
							<Markdown>
								{moreVoicesCountsMarkdown}
							</Markdown>
						</textBase.p>
					</Loading>
				</Discretional>

				<Discretional
					enabled={!haveVoices && this.state.hasWaitedLongEnoughForVoicesToLoad}
				>
					<textBase.h3>
						{translateSync("frontend_installVoicesNoVoiceFoundHeading")}
					</textBase.h3>

					<textBase.p>
						{translateSync("frontend_installVoicesNoVoiceFound")}
					</textBase.p>
				</Discretional>

				<InstallVoicesFaq
					osType={osType}
					showAdditionalDetails={showAdditionalDetails}
				/>
			</section>
		);
	}
}

export default translateAttribute<InstallVoicesProps & TranslateProps>()(
	InstallVoices,
);
