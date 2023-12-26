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
	type SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import CheckboxWithLabel from "../../../components/form/checkbox-with-label.js";
import InformationSection from "../../../components/section/information-section.js";

export interface ContinueOnTabUpdatedUrlProps {
	disabled: boolean;
	onChange: (continueOnTabUpdatedUrl: boolean) => void;
	continueOnTabUpdatedUrl: boolean;
	systemType: SystemType | null;
}

class ContinueOnTabUpdatedUrl<P extends ContinueOnTabUpdatedUrlProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(continueOnTabUpdatedUrl: boolean): void {
		this.props.onChange(continueOnTabUpdatedUrl);
	}

	override render(): React.ReactNode {
		const {
			continueOnTabUpdatedUrl,
			disabled,
			systemType,
			translatePlaceholderSync,
		} = this.props as P;

		return (
			<>
				<textBase.h3>
					{translatePlaceholderSync("When the page address changes" /* "frontend_voicesContinueOnTabUpdatedUrlHeading" */)}
				</textBase.h3>
				<p>
					{translatePlaceholderSync("Address changes happen primarily when clicking a link to go to another page, or when manually typing in the address bar. Certain websites may also change the address in other cases, for example when loading additional information." /* "frontend_voicesContinueOnTabUpdatedUrlExplanation01" */)}
				</p>

				<p>
					{translatePlaceholderSync("When the page address changes, Talkie can either continue speaking or automatically stop. " /* "frontend_voicesContinueOnTabUpdatedUrlExplanation02" */)}
				</p>

				{/* NOTE: Firefox does not report updated tab URLs, even with activeTab permission, because the permission is seemingly cleared upon navigation. */}
				{/* https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions#activetab_permission */}
				<Discretional
					enabled={systemType === "webextension"}
				>
					<InformationSection
						informationType="information"
					>
						<p>
							{translatePlaceholderSync("For privacy reasons, Mozilla Firefox does not always report when the page address changes. Disabling this setting may not have any effect." /* "frontend_voicesContinueOnTabUpdatedUrlExplanation02" */)}
						</p>
					</InformationSection>
				</Discretional>

				<p>
					{/* TODO: consider two radio buttons for continue or stop. */}
					<CheckboxWithLabel
						checked={continueOnTabUpdatedUrl}
						disabled={disabled}
						onChange={this.handleChange}
					>
						{translatePlaceholderSync("Continue speaking when the address changes" /* "frontend_voicesContinueOnTabUpdatedUrlLabel" */)}
					</CheckboxWithLabel>
				</p>
			</>
		);
	}
}

export default translateAttribute<ContinueOnTabUpdatedUrlProps & TranslateProps>()(
	ContinueOnTabUpdatedUrl,
);
