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

import license from "rollup-plugin-license";
import path from "path";

const rollupConfiguration = (name) =>
	license({
		banner: {
			content: {
				file: path.join("..", "..", "build", "LICENSE-BANNER"),
			},
			data: () => ({
				rollupName: name,
			}),
		},
		sourcemap: true,
		thirdParty: {
			output: {
				file: path.join("dist", "rollup", `${name}.dependencies.txt`),
				template: (dependencies) => {
					const thirdPartyDependencies = dependencies
						.filter((dependency) => !dependency.name.startsWith("@talkie/"))
						.slice()
						.sort((a, b) => a.name.localeCompare(b.name));

					return [
						`Talkie's third-party dependencies\n\nhttps://joelpurra.com/projects/talkie/\n\nDetected ${thirdPartyDependencies.length} third-party dependencies in "${name}".`,
						...thirdPartyDependencies.map(
							(dependency, index) =>
								`Dependency #${index + 1}:\n${dependency.text()}`,
						),
					].join("\n\n---\n\n");
				},
			},
		},
	});

export default rollupConfiguration;
