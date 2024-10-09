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

import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log.mjs";

export const getClipboardTextExecCommand = (): string | null => {
	const textarea = document.createElement("textarea");
	textarea.id = "copy-paste-textarea";
	document.body.append(textarea);

	let text: string | null = null;

	try {
		textarea.value = "";
		textarea.focus();

		// NOTE: apart from permissions, getting the clipboard text may require a recent user interaction flag in the call context (which may break during async, callbacks, inter-context messaging).
		// https://developer.mozilla.org/en-US/docs/Web/Security/User_activation#transient_activation
		const success = document.execCommand("Paste");

		text = success
			? textarea.value
			: null;
	} catch (error: unknown) {
		void logError("getClipboardTextExecCommand", "swallowing error", error);
	} finally {
		textarea.remove();
	}

	void logDebug("getClipboardTextExecCommand", text);

	return text;
};

export const getClipboardTextNavigatorReadText = async (): Promise<string | null> => {
	let text: string | null = null;

	try {
		// NOTE: there are discussions (2024-02-02) whether or not readText() should be available in offscreen documents, since it requires document focus.
		// > NotAllowedError: Failed to execute 'readText' on 'Clipboard': Document is not focused.
		// TODO: remove readText() if it is deemed insecure; this decision might also affect execCommand().
		// https://issuetracker.google.com/issues/41497480
		// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
		// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
		const clipboardText = await navigator.clipboard.readText();

		// NOTE: readText() returns an empty string for some clipboard non-text/parsing failures; convert to null internally.
		// > Returns an empty string if the clipboard is empty, does not contain text, or does not include a textual representation among the objects representing the clipboard's contents.
		const success = typeof clipboardText === "string" && clipboardText.length > 0;

		text = success
			? clipboardText
			: null;
	} catch (error: unknown) {
		void logError("getClipboardTextNavigatorReadText", "swallowing error", error);
	}

	void logDebug("getClipboardTextNavigatorReadText", text);

	return text;
};

const getClipboardText = async (): Promise<string | null> => {
	let text: string | null = null;

	// NOTE: documentation says to prefer readText(), but there are discussions regarding the security implications of (continuing to) allowing clipboard access from webexts.
	// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
	// NOTE: firefox does not support readText() until 125 (Released 2024-04-16), so have to support both methods. Also, firefox might not like async access so may need to use getClipboardTextExecCommand() directly.
	// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
	if (typeof navigator?.clipboard?.readText === "function") {
		text = await getClipboardTextNavigatorReadText();
	}

	if (text === null) {
		text = getClipboardTextExecCommand();
	}

	void logDebug("getClipboardText", text);

	return text;
};

export default getClipboardText;
