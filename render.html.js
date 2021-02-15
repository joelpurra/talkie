#!/usr/bin/env node

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

const rendererPath = process.argv[2];
const renderWorkingDirectory = process.argv[3];
const talkieLocale = process.argv[4];

const getHtml = require(rendererPath);

// NOTE: need to change the directory after require().
// NOTE: renderer expects to execute in the root of the output directory, to load any modified files.
process.chdir(renderWorkingDirectory);

const main = async () => {
	try {
		const html = await getHtml(talkieLocale);

		// NOTE: outputting html to stdout.
		// eslint-disable-next-line no-console
		console.log(html);
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
