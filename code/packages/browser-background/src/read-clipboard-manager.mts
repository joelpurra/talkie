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

import MetadataManager from "@talkie/shared-application/metadata-manager.mjs";
import {
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";

import ClipboardManager from "./clipboard-manager.mjs";
import PermissionsManager from "./permissions-manager.mjs";
import TalkieBackground from "./talkie-background.mjs";

export default class ReadClipboardManager {
	// eslint-disable-next-line max-params
	constructor(private readonly clipboardManager: ClipboardManager, private readonly talkieBackground: TalkieBackground, private readonly permissionsManager: PermissionsManager, private readonly metadataManager: MetadataManager, private readonly translator: ITranslatorProvider) {}

	async startSpeaking(): Promise<void> {
		void logDebug("Start", "startSpeaking");

		let text = null;

		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			const hasPermissionsFeature = await this.permissionsManager.browserHasPermissionsFeature();

			if (hasPermissionsFeature) {
				const clipboardText = await this.clipboardManager.getClipboardText();

				if (typeof clipboardText !== "string") {
					text = await this.translator.translate("readClipboardNeedsPermission");
				} else if (clipboardText.length === 0 || clipboardText.trim().length === 0) {
					text = await this.translator.translate("readClipboardNoSuitableText");
				} else {
					text = clipboardText;
				}
			} else {
				text = await this.translator.translate("readClipboardNeedsBrowserSupport");
			}
		} else {
			text = await this.translator.translate("readClipboardIsAPremiumFeature");
		}

		await this.talkieBackground.startSpeakingCustomTextDetectLanguage(text);

		void logDebug("Done", "startSpeaking");
	}
}
