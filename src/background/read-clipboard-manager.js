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
	logDebug,
} from "../shared/log";
import {
	promiseTry,
} from "../shared/promise";

export default class ReadClipboardManager {
	constructor(clipboardManager, talkieBackground, permissionsManager, metadataManager, translator) {
		this.clipboardManager = clipboardManager;
		this.talkieBackground = talkieBackground;
		this.permissionsManager = permissionsManager;
		this.metadataManager = metadataManager;
		this.translator = translator;

		this.copyPasteTargetElementId = "copy-paste-textarea";
	}

	startSpeaking() {
		return promiseTry(
			() => {
				logDebug("Start", "startSpeaking");

				return this.metadataManager.isPremiumEdition()
					.then((isPremiumEdition) => {
						if (!isPremiumEdition) {
							const text = this.translator.translate("readClipboardIsAPremiumFeature");

							return text;
						}

						return this.permissionsManager.browserHasPermissionsFeature()
							.then((hasPermissionsFeature) => {
								if (!hasPermissionsFeature) {
									const text = this.translator.translate("readClipboardNeedsBrowserSupport");

									return text;
								}

								return this.clipboardManager.getClipboardText()
									.then((clipboardText) => {
										let text = clipboardText;

										if (typeof text !== "string") {
											text = this.translator.translate("readClipboardNeedsPermission");
										}

										if (text.length === 0 || text.trim().length === 0) {
											text = this.translator.translate("readClipboardNoSuitableText");
										}

										return text;
									});
							});
					})
					.then((text) => this.talkieBackground.startSpeakingCustomTextDetectLanguage(text))
					.then((result) => {
						logDebug("Done", "startSpeaking");

						return result;
					});
			},
		);
	}
}
