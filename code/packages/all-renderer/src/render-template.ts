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

import render from "@talkie/renderer/render";
import {
	IRenderReactHtmlToFile,
} from "@talkie/renderer/render-types";
import {
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider";
import {
	writeFile as writeFileCallback,
} from "node:fs";
import {
	promisify,
} from "node:util";
import {
	Action,
} from "redux";

import ensureAndGetOutputPath from "./ensure-and-get-output-path";

const writeFile = promisify(writeFileCallback);

const renderTemplate = async <S, A extends Action, P>(baseDirectory: string, app: Readonly<IRenderReactHtmlToFile<S, A, P>>, talkieLocale: TalkieLocale): Promise<void> => {
	const html = await render(
		app.rootReducer,
		app.customPrerenderedActionsToDispatch,
		app.customPostrenderActionsToDispatch,
		app.reactHtmlTemplatePath,
		talkieLocale,
		app.ChildComponent,
	);
	const outpath = await ensureAndGetOutputPath(baseDirectory, app.templateName, talkieLocale);

	await writeFile(outpath, html);
};

export default renderTemplate;
