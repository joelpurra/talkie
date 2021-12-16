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

import ContentLogger from "@talkie/browser-shared/content-logger.mjs";
import {
	FramesSelectionTextAndLanguageCode,
} from "@talkie/shared-ui/hocs/pass-selected-text-to-background-types.mjs";
import {
	isUndefinedOrNullOrEmptyOrWhitespace,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	logDebug,
	logError,
	logInfo,
} from "@talkie/shared-application-helpers/log.mjs";
import ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import {
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import {
	Merge,
	ReadonlyDeep,
} from "type-fest";

export type FramesSelectionTextAndLanguageCodeWithValidText = Merge<FramesSelectionTextAndLanguageCode, {
	text: string;
}>;

export type FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguage = FramesSelectionTextAndLanguageCodeWithValidText & {
	detectedTextLanguage: string | null;
};
export type FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguages = Merge<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguage, {
	parentElementsLanguages: string[];
}>;
export type FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguagesAndEffectiveLanguage = FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguages & {
	effectiveLanguage: string | null;
};
export type TextAndEffectiveLanguage = {
	effectiveLanguage: string;
	text: string;
};

export default class LanguageHelper {
	private readonly noTextSelectedMessage: TextAndEffectiveLanguage;
	private readonly noVoiceForLanguageDetectedMessage: TextAndEffectiveLanguage;
	private readonly iso639Dash1Aliases1988To2002: Record<string, string> = {
		// https://www.iso.org/obp/ui/#iso:std:iso:639:-1:ed-1:v1:en
		// https://en.wikipedia.org/wiki/ISO_639-1
		// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
		// http://xml.coverpages.org/iso639a.html
		// NOTE: discovered because Twitter seems to still use "iw".
		"in": "id",
		iw: "he",
		ji: "yi",
	};

	// The language fallback value is "und", so treat it as "no language".
	private get NoLanguageDetectedCode() {
		return "und";
	}

	constructor(private readonly contentLogger: ContentLogger, private readonly translator: ITranslatorProvider) {
		// TODO: async load/unload logic for classes.
		this.noTextSelectedMessage = {
			// eslint-disable-next-line no-sync
			effectiveLanguage: this.translator.translateSync("extensionLocale"),
			// eslint-disable-next-line no-sync
			text: this.translator.translateSync("noTextSelectedMessage"),
		};

		this.noVoiceForLanguageDetectedMessage = {
			// eslint-disable-next-line no-sync
			effectiveLanguage: this.translator.translateSync("noVoiceForLanguageDetectedMessageLanguage"),
			// eslint-disable-next-line no-sync
			text: this.translator.translateSync("noVoiceForLanguageDetectedMessage"),
		};
	}

	async detectPageLanguage(): Promise<string | null> {
		try {
			// https://developer.chrome.com/extensions/tabs#method-detectLanguage
			const language = await browser.tabs.detectLanguage();

			void logDebug("detectPageLanguage", "Browser detected primary page language", language);

			if (!language || typeof language !== "string" || language === this.NoLanguageDetectedCode) {
				return null;
			}

			return language;
		} catch (error: unknown) {
			// https://github.com/joelpurra/talkie/issues/3
			// NOTE: It seems the Vivaldi browser doesn't (yet/always) support detectLanguage.
			// As this is not critical, just log the error and resolve with null.
			void logError("detectPageLanguage", error);

			return null;
		}
	}

	async detectTextLanguage(text: string): Promise<string | null> {
		// NOTE: text-based language detection is only used as a fallback.
		if (!("detectLanguage" in browser.i18n)) {
			void logDebug("detectTextLanguage", "Browser does not support detecting text language");

			return null;
		}

		// https://developer.chrome.com/extensions/i18n#method-detectLanguage
		const result = await browser.i18n.detectLanguage(text);

		const MINIMUM_RELIABILITY_PERCENTAGE = 50;

		const noLanguagesDetected = !result
			// NOTE: the "isReliable" flag can apparently be false for languages with 100% reliability.
			// NOTE: using the percentage instead.
			// || !result.isReliable
			|| !result.languages
			|| result.languages.length === 0;

		if (noLanguagesDetected) {
			void logDebug("detectTextLanguage", "Browser did not detect any reliable text language", result);

			return null;
		}

		const firstDetectedLanguage = result.languages[0];

		if (typeof firstDetectedLanguage !== "object") {
			void logDebug("detectTextLanguage", "Browser did not detect any reliable text language", result);

			return null;
		}

		if (typeof firstDetectedLanguage.language !== "string") {
			void logDebug("detectTextLanguage", "Browser did not detect any reliable text language", result);

			return null;
		}

		const isLanguageDetected = firstDetectedLanguage.language.trim().length === 0
			|| firstDetectedLanguage.language === this.NoLanguageDetectedCode
			|| firstDetectedLanguage.percentage < MINIMUM_RELIABILITY_PERCENTAGE;

		if (isLanguageDetected) {
			void logDebug("detectTextLanguage", "Browser did not detect any reliable text language", result);

			return null;
		}

		const primaryDetectedTextLanguage = firstDetectedLanguage.language;

		void logDebug("detectTextLanguage", "Browser detected reliable text language", result, primaryDetectedTextLanguage);

		return primaryDetectedTextLanguage;
	}

	async getSelectionsWithValidText(selections: ReadonlyDeep<FramesSelectionTextAndLanguageCode[]>): Promise<ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidText[]>> {
		const isNonNullObject = (selection: ReadonlyDeep<FramesSelectionTextAndLanguageCode>) => Boolean(selection) && typeof selection === "object";
		const hasValidText = (selection: ReadonlyDeep<FramesSelectionTextAndLanguageCode>): selection is FramesSelectionTextAndLanguageCodeWithValidText => !isUndefinedOrNullOrEmptyOrWhitespace(selection.text);
		const trimText = (selection: ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidText>): ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidText> => ({
			...selection,
			text: selection.text.trim(),
		});

		const selectionsWithValidText = selections
			.filter((selection) => isNonNullObject(selection))
			// eslint-disable-next-line unicorn/no-array-callback-reference
			.filter<ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidText>>(hasValidText)
			.map((selection) => trimText(selection))
			.filter((selection) => hasValidText(selection));

		return selectionsWithValidText;
	}

	async detectAndAddLanguageForSelections(selectionsWithValidText: ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidText[]>): Promise<ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguage[]>> {
		return Promise.all(
			selectionsWithValidText.map(
				async (selection): Promise<ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguage>> => ({
					...selection,
					detectedTextLanguage: await this.detectTextLanguage(selection.text),
				}),
			),
		);
	}

	isKnownVoiceLanguage(allVoices: ReadonlyDeep<SafeVoiceObject[]>, elementLanguage: string): boolean {
		return allVoices.some((voice) => voice.lang.startsWith(elementLanguage));
	}

	mapIso639Aliases(language: string): string {
		if (language in this.iso639Dash1Aliases1988To2002) {
			const aliasedLanguageCode = this.iso639Dash1Aliases1988To2002[language];

			if (typeof aliasedLanguageCode !== "string") {
				throw new TypeError("aliasedLanguageCode");
			}

			return aliasedLanguageCode;
		}

		return language;
	}

	cleanupLanguagesArray(allVoices: ReadonlyDeep<SafeVoiceObject[]>, languages: Readonly<Array<string | null | undefined>> | null): Readonly<string[]> {
		const copy = (languages ?? [])
			.filter<string>((string): string is string => !isUndefinedOrNullOrEmptyOrWhitespace(string))
			.map((language) => this.mapIso639Aliases(language))
			.filter((elementLanguage) => this.isKnownVoiceLanguage(allVoices, elementLanguage));

		return copy;
	}

	async getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage(allVoices: ReadonlyDeep<SafeVoiceObject[]>, detectedPageLanguage: string | null, selectionsWithValidTextAndDetectedLanguage: ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguage[]>): Promise<ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguagesAndEffectiveLanguage[]>> {
		const cleanupParentElementsLanguages = (selection: ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguage>): ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguages> => ({
			...selection,
			parentElementsLanguages: this.cleanupLanguagesArray(allVoices, selection.parentElementsLanguages),
		});

		const getMoreSpecificLanguagesWithPrefix = (prefix: string | null): (language: string) => boolean => {
			if (typeof prefix === "string") {
				return (language: string) => language.startsWith(prefix) && language.length > prefix.length;
			}

			// NOTE: allow all nulls to avoid some typechecking.
			return (_language: string) => true;
		};

		const setEffectiveLanguage = (selection: ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguages>): ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguagesAndEffectiveLanguage> => {
			const detectedLanguages = [
				selection.detectedTextLanguage,
				selection.parentElementsLanguages[0] ?? null,
				selection.htmlTagLanguage,
				detectedPageLanguage,
			];

			void logDebug("setEffectiveLanguage", "detectedLanguages", detectedLanguages);

			const cleanedLanguages = this.cleanupLanguagesArray(allVoices, detectedLanguages);

			void logDebug("setEffectiveLanguage", "cleanedLanguages", cleanedLanguages);

			const primaryLanguagePrefix = cleanedLanguages[0] ?? null;

			void logDebug("setEffectiveLanguage", "primaryLanguagePrefix", primaryLanguagePrefix);

			// NOTE: if there is a more specific language with the same prefix among the detected languages, prefer it.
			const cleanedLanguagesWithPrimaryPrefix = cleanedLanguages.filter(getMoreSpecificLanguagesWithPrefix(primaryLanguagePrefix));

			void logDebug("setEffectiveLanguage", "cleanedLanguagesWithPrimaryPrefix", cleanedLanguagesWithPrimaryPrefix);

			const effectiveLanguage = cleanedLanguagesWithPrimaryPrefix[0] ?? cleanedLanguages[0] ?? null;

			void logDebug("setEffectiveLanguage", "effectiveLanguage", effectiveLanguage);

			const selectionWithEffectiveLanguage = {
				...selection,
				effectiveLanguage,
			};

			// TODO: report language results and move logging elsewhere?
			// NOTE: logging is performed outside of the regular async chain.
			void this.contentLogger.logToPage("Language", {
				"Detected page language:": detectedPageLanguage,
				"Effective language:": selectionWithEffectiveLanguage.effectiveLanguage,
				"HTML tag language:": selectionWithEffectiveLanguage.htmlTagLanguage,
				"Selected text element language:": selectionWithEffectiveLanguage.parentElementsLanguages[0] ?? null,
				"Selected text language:": selectionWithEffectiveLanguage.detectedTextLanguage,
			})
				.catch((error: unknown) => {
					if (typeof error === "object" && error !== null && "message" in error) {
						const {
							message,
						} = error as Error;
						if (typeof message === "string" && message.startsWith("Cannot access")) {
							// NOTE: reduced logging for known tab/page access problems.
							void logDebug("setEffectiveLanguage", "Error", typeof error, JSON.stringify(error), error);
						} else {
							void logInfo("setEffectiveLanguage", "Error", typeof error, JSON.stringify(error), error);
						}
					} else {
						// NOTE: swallowing any logToPage() errors.
					}
				});

			return selectionWithEffectiveLanguage;
		};

		const selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage = selectionsWithValidTextAndDetectedLanguage
			.map<ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguages>>((selection) => cleanupParentElementsLanguages(selection))
			.map((selection) => setEffectiveLanguage(selection));

		return selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage;
	}

	async useFallbackMessageIfNoLanguageDetected(selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage: ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguagesAndEffectiveLanguage[]>): Promise<ReadonlyDeep<TextAndEffectiveLanguage[]>> {
		const fallbackMessageForNoLanguageDetected = (selection: ReadonlyDeep<FramesSelectionTextAndLanguageCodeWithValidTextAndDetectedTextLanguageAndParentElementsLanguagesAndEffectiveLanguage>): TextAndEffectiveLanguage => {
			if (selection.effectiveLanguage === null) {
				return this.noVoiceForLanguageDetectedMessage;
			}

			return selection as TextAndEffectiveLanguage;
		};

		const mapResults = (selection: ReadonlyDeep<TextAndEffectiveLanguage>): ReadonlyDeep<TextAndEffectiveLanguage> => ({
			effectiveLanguage: selection.effectiveLanguage,
			text: selection.text,
		});

		const results = selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage
			.map<ReadonlyDeep<TextAndEffectiveLanguage>>((selection) => fallbackMessageForNoLanguageDetected(selection))
			.map((selection) => mapResults(selection));

		if (results.length === 0) {
			void logDebug("Empty filtered selections");

			results.push(this.noTextSelectedMessage);
		}

		return results;
	}

	async cleanupSelections(allVoices: ReadonlyDeep<SafeVoiceObject[]>, detectedPageLanguage: string | null, selections: ReadonlyDeep<FramesSelectionTextAndLanguageCode[]>): Promise<ReadonlyDeep<TextAndEffectiveLanguage[]>> {
		const selectionsWithValidText = await this.getSelectionsWithValidText(selections);
		const selectionsWithValidTextAndDetectedLanguage = await this.detectAndAddLanguageForSelections(selectionsWithValidText);
		const selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage = await this.getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage(allVoices, detectedPageLanguage, selectionsWithValidTextAndDetectedLanguage);

		return this.useFallbackMessageIfNoLanguageDetected(selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage);
	}
}
