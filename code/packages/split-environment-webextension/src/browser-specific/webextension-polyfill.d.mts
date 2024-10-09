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

// eslint-disable-next-line import/no-unassigned-import
import "webextension-polyfill";

module "webextension-polyfill" {
	import type {
		Browser as WebExtBrowser,
		Runtime as WebExtRuntime,
	} from "webextension-polyfill";

	namespace Runtime {
		// NOTE: implementing only a limited offscreen use-case.
		interface ExtensionContext {
			contextId: string;
		}

		// NOTE: implementing only a limited offscreen use-case.
		interface OffscreenContextFilter {
			contextTypes: readonly [
				"OFFSCREEN_DOCUMENT",
			];
			documentUrls: readonly string[];
		}

		interface Static {
			getContexts: (filter: Readonly<OffscreenContextFilter>) => Promise<ExtensionContext[]>;
		}
	}

	// https://developer.chrome.com/docs/extensions/reference/api/offscreen
	export namespace Offscreen {
		interface CreateParameters {
			url: readonly string;
			reasons: ReadonlyArray<keyof Reason>;
			justification: readonly string;
		}

		// NOTE: implementing only a limited offscreen use-case.
		interface Reason {
			AUDIO_PLAYBACK: readonly "AUDIO_PLAYBACK";
			CLIPBOARD: readonly "CLIPBOARD";
		}

		interface Static {
			closeDocument: () => Promise<void>;
			createDocument: (parameters: Readonly<CreateParameters>) => Promise<void>;
		}
	}

	namespace Browser {
		interface Browser extends WebExtBrowser {
			runtime: readonly WebExtRuntime.Static;
			offscreen: readonly Offscreen.Static;
		}
	}
}

declare global {
	import type {
		Browser,
	} from "webextension-polyfill";

	// NOTE: this file is linked/used in several projects.
	// TODO: deduplicate this file.
	const chrome: Browser.Browser;
}
