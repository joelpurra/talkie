/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type ReadClipboardPermissionManager from "@talkie/browser-shared/read-clipboard-permission-manager.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";

import type SpeakerPageManager from "./speaker-page-manager.mjs";

import {
	bespeak,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	type IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";

export default class SpeakClipboardManager {
	// eslint-disable-next-line max-params
	constructor(
		private readonly messageBusProviderGetter: IMessageBusProviderGetter,
		private readonly speakerPageManager: SpeakerPageManager,
		private readonly readClipboardPermissionsManager: ReadClipboardPermissionManager,
		private readonly premiumManager: IPremiumManager,
		private readonly translator: ITranslatorProvider,
	) {}

	async checkPermissionAndSpeak(): Promise<void> {
		void logDebug("Start", "checkPermissionAndSpeak");

		let text = null;

		const [
			isPremiumEdition,
			hasPermission,
		] = await Promise.all([
			this.premiumManager.isPremiumEdition(),
			this.readClipboardPermissionsManager.hasPermission(),
		]);

		if (isPremiumEdition) {
			switch (hasPermission) {
				case true: {
					const clipboardText = await bespeak(this.messageBusProviderGetter, "offscreen:clipboard:read");

					if (typeof clipboardText !== "string") {
						text = await this.translator.translate("readClipboardNeedsPermission");
					} else if (clipboardText.length === 0 || clipboardText.trim().length === 0) {
						text = await this.translator.translate("readClipboardNoSuitableText");
					} else {
						text = clipboardText;
					}

					break;
				}

				case false: {
					text = await this.translator.translate("readClipboardNeedsPermission");

					break;
				}

				case null: {
					text = await this.translator.translate("readClipboardNeedsBrowserSupport");

					break;
				}

				default: {
					throw new Error("What even is that?");
				}
			}
		} else {
			text = await this.translator.translate("readClipboardIsAPremiumFeature");
		}

		await this.speakerPageManager.startSpeakingCustomTextDetectLanguage(text);

		void logDebug("Done", "checkPermissionAndSpeak");
	}
}
