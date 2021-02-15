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

export default class Plug {
	constructor(contentLogger, execute, configuration) {
		this.contentLogger = contentLogger;
		this.execute = execute;
		this.configuration = configuration;

		this.executeGetTalkieWasPluggedCode = "(function(){ return window.talkieWasPlugged; }());";
		this.executeSetTalkieWasPluggedCode = "(function(){ window.talkieWasPlugged = true; }());";
	}

	async executePlug() {
		// TODO: premium version of the same message?
		await this.contentLogger.logToPageWithColor("Thank you for using Talkie!");
		await this.contentLogger.logToPageWithColor("https://joelpurra.com/projects/talkie/");
		await this.contentLogger.logToPageWithColor("Created by Joel Purra. Released under GNU General Public License version 3.0 (GPL-3.0)");
		await this.contentLogger.logToPageWithColor("https://joelpurra.com/");
		await this.contentLogger.logToPageWithColor("If you like Talkie, send a link to your friends -- and consider upgrading to Talkie Premium to support further open source development.");
	}

	executeGetTalkieWasPlugged() {
		return this.execute.scriptInTopFrameWithTimeout(this.executeGetTalkieWasPluggedCode, 1000);
	}

	executeSetTalkieWasPlugged() {
		return this.execute.scriptInTopFrameWithTimeout(this.executeSetTalkieWasPluggedCode, 1000);
	}

	async once() {
		const talkieWasPlugged = await this.executeGetTalkieWasPlugged();

		if (talkieWasPlugged && talkieWasPlugged.toString() !== "true") {
			await this.executePlug();
			await this.executeSetTalkieWasPlugged();
		}
	}
}
