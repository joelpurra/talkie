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

import ContentLogger from "./content-logger.mjs";
import Execute from "./execute.mjs";

export default class Plug {
	constructor(private readonly contentLogger: ContentLogger, private readonly execute: Execute) {}

	private get executeGetTalkieWasPluggedCode() {
		return "(function(){ return window.talkieWasPlugged; }());";
	}

	private get executeSetTalkieWasPluggedCode() {
		return "(function(){ window.talkieWasPlugged = true; }());";
	}

	async executePlug(): Promise<void> {
		// TODO: premium version of the same message?
		await this.contentLogger.logToPageWithColor("Thank you for using Talkie!");
		await this.contentLogger.logToPageWithColor("https://joelpurra.com/projects/talkie/");
		await this.contentLogger.logToPageWithColor("Created by Joel Purra. Released under GNU General Public License version 3.0 (GPL-3.0)");
		await this.contentLogger.logToPageWithColor("https://joelpurra.com/");
		await this.contentLogger.logToPageWithColor("If you like Talkie, send a link to your friends -- and consider upgrading to Talkie Premium to support further open source development.");
	}

	async executeGetTalkieWasPlugged(): Promise<unknown[]> {
		return this.execute.scriptInTopFrameWithTimeout(this.executeGetTalkieWasPluggedCode, 1000);
	}

	async executeSetTalkieWasPlugged(): Promise<void> {
		await this.execute.scriptInTopFrameWithTimeout(this.executeSetTalkieWasPluggedCode, 1000);
	}

	async once(): Promise<void> {
		const talkieWasPlugged = await this.executeGetTalkieWasPlugged();

		// TODO: verify ambiguity regarding whether the value is a single value or an array, when executed in a single frame. The standard may have changed.
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript
		// https://developer.chrome.com/docs/extensions/reference/tabs/#method-executeScript
		// https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/api/tabs.json
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const talkieWasPluggedValue = Array.isArray(talkieWasPlugged) ? talkieWasPlugged[0] : talkieWasPlugged;

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		if (talkieWasPluggedValue && talkieWasPluggedValue.toString() !== "true") {
			await this.executePlug();
			await this.executeSetTalkieWasPlugged();
		}
	}
}
