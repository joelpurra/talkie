/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import assert from "assert";
import { readFileSync, statSync } from "fs";
import path from "path";

import copy from "rollup-plugin-copy";

import { isTalkieDevelopmentMode } from "./talkie-build-mode.mjs";

const getLines = (buffer) =>
	// TODO: readline for await of
	// https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
	buffer
		.toString()
		.split("\n")
		// NOTE: skip empty lines.
		.filter((line) => !!line.trim());

const normalizePath = (...segments) => path.normalize(path.join(...segments));

const getCopyTargets = (
	fileListFilePath,
	packageRootDirectory,
	codeRootRelativeDirectory,
	destinationBaseDirectory,
	outputRelativeDirectory,
) => {
	const file = readFileSync(fileListFilePath);
	const lines = getLines(file);

	const resolvedSource = normalizePath(
		packageRootDirectory,
		codeRootRelativeDirectory,
	);
	const resolvedDestination = normalizePath(
		destinationBaseDirectory,
		outputRelativeDirectory,
	);

	const targets = lines.map((file) => {
		const src = normalizePath(resolvedSource, file);

		// NOTE: check if the source file exists.
		// https://github.com/vladshcherbin/rollup-plugin-copy/issues/57
		statSync(src, {
			throwIfNoEntry: true,
		});

		const dest = normalizePath(
			resolvedDestination,

			// NOTE: make sure destination is the containing directory, otherwise a directory with the same name as the file will be created.
			path.dirname(file),
		);

		return {
			src,
			dest,
		};
	});

	return targets;
};

const rollupConfiguration = (
	repositoryRootDirectory,
	packageRootDirectory,
	outputBaseDirectory,
) => {
	const fileListFileBasePath = normalizePath(
		repositoryRootDirectory,
		"code",
		"packages",
		"output-webext",
		"src",
		"package-files",
	);

	return copy({
		targets: [
			...[
				normalizePath(fileListFileBasePath, fileLists.code),
				normalizePath(fileListFileBasePath, fileLists.resources),
				normalizePath(fileListFileBasePath, fileLists.licenses),

				// NOTE: per-repository file list.
				normalizePath(packageRootDirectory, "webext.files.txt"),
			].flatMap((filesPath) =>
				getCopyTargets(
					filesPath,
					packageRootDirectory,
					"../..",
					outputBaseDirectory,
					".",
				),
			),
			...getCopyTargets(
				normalizePath(fileListFileBasePath, fileLists.locales),
				packageRootDirectory,
				"../shared-locales/dist/data",
				outputBaseDirectory,
				".",
			),
		].filter(
			// NOTE: for production/development file list consistency: first adding, then filtering out, *.map files.
			// NOTE: have to check the filename of the source path; see destination directory notes.
			({ src }) => isTalkieDevelopmentMode() || !src.endsWith(".map"),
		),
	});
};

const fileLists = {
	code: "code.txt",
	licenses: "licenses.txt",
	locales: "locales.txt",
	resources: "resources.txt",
};

export default rollupConfiguration;
