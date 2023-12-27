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

import path from "path";
import copy from "rollup-plugin-copy";
import { readFileSync, statSync } from "fs";

const extensionFiles = "code.txt";
const licensesFiles = "licenses.txt";
const localesFiles = "locales.txt";
const rootFiles = "root.txt";

const getLines = (buffer) => {
	// TODO: readline for await of
	// https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
	return (
		buffer
			.toString()
			.split("\n")
			// NOTE: skip empty lines.
			.filter((line) => !!line.trim())
	);
};

const getCopyTargets = (
	fileListFile,
	repositoryRoot,
	sourceBase,
	source,
	destinationBase,
	destination,
) => {
	const resolvedSource = path.join(sourceBase, source);
	const resolvedDestination = path.join(destinationBase, destination);
	const fileListFilePath = path.join(
		repositoryRoot,
		"code",
		"packages",
		"output-webext",
		"src",
		"package-files",
		fileListFile,
	);
	const file = readFileSync(fileListFilePath);
	const lines = getLines(file);

	const targets = lines.map((file) => {
		const src = path.join(resolvedSource, file);
		const dest = path.join(
			resolvedDestination,

			// NOTE: make sure destination is the containing directory, otherwise a directory with the same name as the file will be created.
			path.dirname(file),
		);

		// NOTE: check if the source file exists.
		statSync(src);

		return {
			src,
			dest,
		};
	});

	return targets;
};

const rollupConfiguration = (repositoryRoot, sourceBase, destinationBase) =>
	copy({
		targets: [
			...getCopyTargets(
				rootFiles,
				repositoryRoot,
				sourceBase,
				"../../..",
				destinationBase,
				".",
			),
			...getCopyTargets(
				extensionFiles,
				repositoryRoot,
				sourceBase,
				"../..",
				destinationBase,
				".",
			),
			...getCopyTargets(
				licensesFiles,
				repositoryRoot,
				sourceBase,
				"../..",
				destinationBase,
				".",
			),
			...getCopyTargets(
				localesFiles,
				repositoryRoot,
				sourceBase,
				"../shared-locales/src/data",
				destinationBase,
				".",
			),
		],
	});

export default rollupConfiguration;
