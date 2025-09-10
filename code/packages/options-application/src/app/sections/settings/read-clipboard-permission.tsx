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
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import type {
	OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";

import type {
	actions,
} from "../../../slices/index.mjs";

import Discretional from "@talkie/shared-ui/components/discretional.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import MarkdownParagraph from "../../../components/markdown/paragraph.js";
import EditionSection from "../../../components/section/edition-section.js";

export interface ReadClipboardPermissionProps {
	askClipboardReadPermission: typeof actions.shared.clipboard.askClipboardReadPermission;
	clipboardText: string | null | undefined;
	denyClipboardReadPermission: typeof actions.shared.clipboard.denyClipboardReadPermission;
	disabled: boolean;
	hasClipboardReadPermission: boolean | null;
	isPremiumEdition: boolean;
	onOpenShortKeysConfigurationClick: OnOpenShortcutKeysClickProp;
	readFromClipboard: typeof actions.shared.clipboard.readFromClipboard;
	showAdditionalDetails: boolean;
	speakFromClipboard: typeof actions.shared.clipboard.speakFromClipboard;
	systemType: SystemType | null;
}

class ReadClipboardPermission<P extends ReadClipboardPermissionProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);
		this.askClipboardReadPermissionClick = this.askClipboardReadPermissionClick.bind(this);
		this.denyClipboardReadPermissionClick = this.denyClipboardReadPermissionClick.bind(this);
		this.readFromClipboardClick = this.readFromClipboardClick.bind(this);
		this.speakFromClipboardClick = this.speakFromClipboardClick.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOpenShortKeysConfigurationClick(event: Readonly<React.MouseEvent>): false {
		return this.props.onOpenShortKeysConfigurationClick(event);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	askClipboardReadPermissionClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.askClipboardReadPermission();

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	denyClipboardReadPermissionClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.denyClipboardReadPermission();

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	speakFromClipboardClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.speakFromClipboard();

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	readFromClipboardClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.readFromClipboard();

		return false;
	}

	override render(): React.ReactNode {
		const {
			clipboardText,
			configure,
			hasClipboardReadPermission,
			disabled,
			isPremiumEdition,
			showAdditionalDetails,
			systemType,
			translateSync,
		} = this.props as P;

		let hasClipboardReadPermissionText;
		let hasClipboardReadPermissionEmoji;

		switch (hasClipboardReadPermission) {
			case true: {
				hasClipboardReadPermissionEmoji = "✅";
				hasClipboardReadPermissionText = translateSync("frontend_settingsReadClipboardPermissionGranted");

				break;
			}

			case false: {
				hasClipboardReadPermissionEmoji = null;
				hasClipboardReadPermissionText = isPremiumEdition
					? translateSync("frontend_settingsReadClipboardPermissionDenied")
					: null;

				break;
			}

			case null: {
				hasClipboardReadPermissionEmoji = "⁉️";
				hasClipboardReadPermissionText = translateSync("frontend_settingsReadClipboardPermissionUnknown");

				break;
			}
		}

		let clipboardTextOrStatus: string;

		switch (clipboardText) {
			case undefined: {
				clipboardTextOrStatus = translateSync("frontend_settingsReadClipboardTextNotYetRead");

				break;
			}

			case null: {
				clipboardTextOrStatus = translateSync("frontend_settingsReadClipboardTextCouldNotRead");

				break;
			}

			default: {
				clipboardTextOrStatus = translateSync("frontend_settingsReadClipboardTextCouldRead");

				break;
			}
		}

		const clipboardTextOrStatusElement: React.ReactNode = typeof clipboardText === "string"
			? (
				// TODO: limit text, either in the string or in styling/css?
				// TODO: break out user-input-text/ blockquote/markdown pattern to element?
				// TODO: detect text direction?
				// className={textDirectionClassNameForDetectedLanguageGroup}
				<textBase.blockquote>
					<MarkdownParagraph>
						{clipboardText}
					</MarkdownParagraph>
				</textBase.blockquote>
			)
			: null;

		return (
			<>
				<textBase.h2>
					{translateSync("frontend_settingsReadClipboardPermissionHeading")}
				</textBase.h2>

				<p>
					{translateSync("frontend_settingsReadClipboardPermissionExplanation01")}
				</p>

				<p>
					<a
						href={configure("urls.external.shortcut-keys")}
						// NOTE: only handle the click in Chrome, as the feature can't be used in Firefox.
						onClick={systemType === "chrome" ? this.handleOpenShortKeysConfigurationClick : undefined}
					>
						{translateSync("frontend_usageShortcutKeyAlternative05")}
					</a>
				</p>

				<EditionSection
					isPremiumEdition
					mode="p"
				>
					<p>
						{translateSync("frontend_settingsReadClipboardPermissionExplanation02")}
					</p>

					<p>
						{hasClipboardReadPermissionEmoji}
						{" "}
						{hasClipboardReadPermissionText}
					</p>

					<layoutBase.horizontalUl>
						<layoutBase.horizontalLi>
							<button
								disabled={disabled || !isPremiumEdition || hasClipboardReadPermission === true}
								type="button"
								onClick={this.askClipboardReadPermissionClick}
							>
								{translateSync("frontend_settingsReadClipboardPermissionGrant")}
							</button>
						</layoutBase.horizontalLi>
						<layoutBase.horizontalLi>
							<button
								disabled={disabled || hasClipboardReadPermission === false}
								type="button"
								onClick={this.denyClipboardReadPermissionClick}
							>
								{translateSync("frontend_settingsReadClipboardPermissionDeny")}
							</button>
						</layoutBase.horizontalLi>
						<layoutBase.horizontalLi>
							<button
								disabled={disabled || !isPremiumEdition || hasClipboardReadPermission !== true}
								type="button"
								onClick={this.speakFromClipboardClick}
							>
								{translateSync("frontend_settingsReadClipboardSpeakClipboard")}
							</button>
						</layoutBase.horizontalLi>

						<Discretional
							enabled={showAdditionalDetails}
						>
							<layoutBase.horizontalLi>
								<button
									disabled={disabled || !isPremiumEdition || hasClipboardReadPermission !== true}
									type="button"
									onClick={this.readFromClipboardClick}
								>
									{translateSync("frontend_settingsReadClipboardDisplayClipboard")}
								</button>
							</layoutBase.horizontalLi>
						</Discretional>
					</layoutBase.horizontalUl>

					<Discretional
						enabled={showAdditionalDetails && hasClipboardReadPermission === true}
					>
						<p>
							{clipboardTextOrStatus}
						</p>

						{clipboardTextOrStatusElement}
					</Discretional>
				</EditionSection>
			</>
		);
	}
}

export default configureAttribute<ReadClipboardPermissionProps & ConfigureProps>()(
	translateAttribute<ReadClipboardPermissionProps & ConfigureProps & TranslateProps>()(
		ReadClipboardPermission,
	),
);
