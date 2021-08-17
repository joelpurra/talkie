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

import {
	IRenderReactHtmlToFile,
} from "@talkie/renderer/render-types";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper";
import {
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider";
import {
	Action,
} from "redux";

import getAllApplications from "./get-all-applications";
import renderTemplate from "./render-template";

const renderTemplates = async <S, A extends Action, P>(baseDirectory: string): Promise<void> => {
	const renderReactHtmlApps = await getAllApplications<S, A, P>();
	const templateHtmlExtension = ".template.html";

	for (const app of renderReactHtmlApps) {
		if (!app.reactHtmlTemplatePath.endsWith(templateHtmlExtension)) {
			throw new Error(`Filename must end with ${JSON.stringify(templateHtmlExtension)} ${JSON.stringify(app.reactHtmlTemplatePath)}`);
		}
	}

	const talkieLocaleHelper = new TalkieLocaleHelper();
	const talkieLocales = await talkieLocaleHelper.getTranslatedLanguages();

	// NOTE: parallel rendering.
	await Promise.all<void[]>(
		renderReactHtmlApps.map(
			async (app: Readonly<IRenderReactHtmlToFile<S, A, P>>) => Promise.all<void>(
				talkieLocales.map(
					async (talkieLocale: TalkieLocale) => renderTemplate(baseDirectory, app, talkieLocale),
				),
			),
		),
	);
};

export default renderTemplates;
