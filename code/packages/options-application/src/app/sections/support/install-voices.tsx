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
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import Loading from "../../../components/loading.js";
import MarkdownStrong from "../../../components/markdown/strong.js";
import InstallVoicesFaq from "./install-voices-faq.js";

interface InstallVoicesState {
	hasWaitedLongEnoughForVoicesToLoad: boolean;
}

export interface InstallVoicesProps {
	haveVoices: boolean;
	languageGroupsCount: number;
	languagesCount: number;
	osType?: OsType | null;
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

	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// https://nodejs.org/api/timers.html#timers_class_timeout
	// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _voiceLoadTimeoutId: any | null;

	constructor(props: P) {
		super(props);

		this.componentDidMount = this.componentCleanup.bind(this);
	}

	override componentDidMount() {
		this._voiceLoadTimeoutId = setTimeout(
			() => {
				this.setState({
					hasWaitedLongEnoughForVoicesToLoad: true,
				});
			},
			5000,
		);
	}

	override componentWillUnmount(): void {
		this.componentCleanup();
	}

	componentCleanup() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		clearTimeout(this._voiceLoadTimeoutId);
	}

	override render(): React.ReactNode {
		const {
			haveVoices,
			languageGroupsCount,
			languagesCount,
			osType,
			translateSync,
			voicesCount,
		} = this.props;

		// NOTE: don't show additional details on the welcome page.
		const showAdditionalDetails = false;

		const moreVoicesCountsMarkdown = translateSync("frontend_welcomeInstallMoreVoicesDescription", [
			`**${voicesCount.toString(10)}**`,
			`**${languageGroupsCount.toString(10)}**`,
			`**${languagesCount.toString(10)}**`,
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
							<MarkdownStrong>
								{moreVoicesCountsMarkdown}
							</MarkdownStrong>
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
