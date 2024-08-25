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
import type {
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import type {
	OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

import MarkdownParagraph from "../../../components/markdown/paragraph.js";
import EditionSection from "../../../components/section/edition-section.js";
import type {
	actions,
} from "../../../slices/index.mjs";

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
			translatePlaceholderSync,
			translateSync,
		} = this.props as P;

		let hasClipboardReadPermissionText;
		let hasClipboardReadPermissionEmoji;

		switch (hasClipboardReadPermission) {
			case true: {
				hasClipboardReadPermissionEmoji = "✅";
				hasClipboardReadPermissionText = translatePlaceholderSync("Clipboard access granted." /* "frontend_settingsReadClipboardPermissionGranted" */);

				break;
			}

			case false: {
				hasClipboardReadPermissionEmoji = null;
				hasClipboardReadPermissionText = isPremiumEdition
					? translatePlaceholderSync("Clipboard access not granted." /* "frontend_settingsReadClipboardPermissionDenied" */)
					: null;

				break;
			}

			case null: {
				hasClipboardReadPermissionEmoji = "⁉️";
				hasClipboardReadPermissionText = translatePlaceholderSync("Clipboard access unknown or failing." /* "frontend_settingsReadClipboardPermissionDenied" */);

				break;
			}

			default: {
				throw new Error("How did it come to this?");
			}
		}

		let clipboardTextOrStatus: string;

		switch (clipboardText) {
			case undefined: {
				clipboardTextOrStatus = translatePlaceholderSync("Clipboard text has not been read." /* frontend_settingsReadClipboardTextNotYetRead */);

				break;
			}

			case null: {
				clipboardTextOrStatus = translatePlaceholderSync("Clipboard text could not be read." /* frontend_settingsReadClipboardTextCouldNotRead */);

				break;
			}

			default: {
				clipboardTextOrStatus = translatePlaceholderSync("Clipboard text could be read." /* "frontend_settingsReadClipboardTextCouldRead" */);

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
					{translatePlaceholderSync("Permission to access the clipboard" /* "frontend_settingsReadClipboardPermissionHeading" */)}
				</textBase.h2>

				<p>
					{translatePlaceholderSync("To speak text from any program, you can copy text to the clipboard and use the configurable keyboard shortcut. For Talkie to access the clipboard you need to grant permission first. This is a Talkie Premium feature." /* "frontend_settingsReadClipboardPermissionExplanation01" */)}
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
						{translatePlaceholderSync("Grant or deny your permission any time. Your browser may or may not ask you to confirm." /* "frontend_settingsReadClipboardPermissionExplanation02" */)}
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
								{translatePlaceholderSync("Grant clipboard permission" /* "frontend_settingsReadClipboardPermissionGrant" */)}
							</button>
						</layoutBase.horizontalLi>
						<layoutBase.horizontalLi>
							<button
								disabled={disabled || hasClipboardReadPermission === false}
								type="button"
								onClick={this.denyClipboardReadPermissionClick}
							>
								{translatePlaceholderSync("Deny clipboard permission" /* "frontend_settingsReadClipboardPermissionDeny" */)}
							</button>
						</layoutBase.horizontalLi>
						<layoutBase.horizontalLi>
							<button
								disabled={disabled || !isPremiumEdition || hasClipboardReadPermission !== true}
								type="button"
								onClick={this.speakFromClipboardClick}
							>
								{translatePlaceholderSync("Speak clipboard text" /* "frontend_settingsReadClipboardPermissionDeny" */)}
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
									{translatePlaceholderSync("Display clipboard text" /* "frontend_settingsReadClipboardPermissionGrant" */)}
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
