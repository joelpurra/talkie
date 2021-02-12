// TODO: fix hashbang compile-time parsing.
// #!/usr/bin/env node

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

import FilesTranslator from "./files-translator";
import GoogleCloudTranslateTranslator from "./google-cloud-translate-translator-service";
import MessagesTranslator from "./messages-translator";
import MessagesTranslatorFactory from "./messages-translator-factory";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Bluebird = require("bluebird");
const configuration = require("configvention");

const readDir = Bluebird.promisify(fs.readdir);
const stat = Bluebird.promisify(fs.stat);

const getDirectoryNames = async (directoryPath) => {
	const files = await readDir(directoryPath);

	const directories = Bluebird.filter(
		// eslint-disable-next-line unicorn/no-fn-reference-in-iterator
		files,
		async (file) => {
			const fullPath = path.join(directoryPath, file);
			const entry = await stat(fullPath);

			return entry.isDirectory();
		},
	);

	return directories;
};

const localesDirectoryName = "_locales";

const getLocalesPath = (rootDirectoryPath) => {
	return path.join(rootDirectoryPath, localesDirectoryName);
};

const getLocaleFilePath = (rootDirectoryPath, localeName, localeFilename) => {
	return path.join(getLocalesPath(rootDirectoryPath), localeName, localeFilename);
};

const main = async () => {
	const args = process.argv.slice(2);
	const languageCodeRx = /[a-z]{2}(_[A-Z]{2})?/;

	assert(args.length >= 4);

	// TODO: check resolved path?
	assert(typeof args[0] === "string");

	assert(typeof args[1] === "string");
	assert(languageCodeRx.test(args[1]));

	assert(typeof args[2] === "string");
	assert(args[2].endsWith(".json"));

	assert(typeof args[3] === "string");
	assert(args[3].endsWith(".json"));

	if (args.length > 4) {
		args.slice(4).forEach((arg) => {
			assert(languageCodeRx.test(arg));
		});
	}

	const [
		rootDirectoryPath,
		baseLanguageCode,
		baseFileName,
		automaticTranslationFilename,
		...languageCodes
	] = args;

	const googleCloudTranslateApiKeyFilePath = configuration.get("GOOGLE_TRANSLATE_API_KEY_FILE_PATH");

	const translatorService = new GoogleCloudTranslateTranslator(googleCloudTranslateApiKeyFilePath);
	const messagesTranslatorFactory = new MessagesTranslatorFactory(translatorService, MessagesTranslator);

	const base = {
		filePath: getLocaleFilePath(rootDirectoryPath, baseLanguageCode, baseFileName),
		language: baseLanguageCode,
	};

	try {
		let effectiveLanguageCodes = languageCodes;

		if (languageCodes.length === 0) {
			const localesDirectoryPath = getLocalesPath(rootDirectoryPath);

			effectiveLanguageCodes = await getDirectoryNames(localesDirectoryPath);
		}

		const localeNames = effectiveLanguageCodes.filter((localeName) => localeName !== baseLanguageCode);

		const locales = localeNames.map((localeName) => ({
			filePath: getLocaleFilePath(rootDirectoryPath, localeName, automaticTranslationFilename),
			language: localeName,
		}));

		const filesTranslator = new FilesTranslator(messagesTranslatorFactory, base, locales);

		await filesTranslator.translate();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);

		process.exitCode = 3;
	}
};

try {
	process.on("unhandledRejection", (error) => {
		// eslint-disable-next-line no-console
		console.error("unhandledRejection", error);

		process.exitCode = 2;
	});

	main();
} catch (error) {
	// eslint-disable-next-line no-console
	console.error(error);

	process.exitCode = 1;
}
