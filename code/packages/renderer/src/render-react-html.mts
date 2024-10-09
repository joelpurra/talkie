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

import type {
	Action,
	Store,
} from "@reduxjs/toolkit";
import type ILocaleProvider from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import type IStyletronProvider from "@talkie/split-environment-interfaces/istyletron-provider.mjs";
import {
	type ReactElement,
} from "react";
import ReactDOMServer from "react-dom/server.js";
import type {
	Server as StyletronServer,
} from "styletron-engine-atomic";
import type {
	ReadonlyDeep,
} from "type-fest";

import {
	type ReactHtmlTemplateLocalsVariables,
} from "./render-types.mjs";

const renderReactHtml = async <S, A extends Action>(
	store: Readonly<Store<S, A>>,
	reactHtmlTemplateLocalsVariables: ReactHtmlTemplateLocalsVariables,
	localeProvider: ReadonlyDeep<ILocaleProvider>,
	styletronProvider: ReadonlyDeep<IStyletronProvider>,
	rootElement: Readonly<ReactElement>,
	// eslint-disable-next-line max-params
): Promise<string> => {
	// HACK: casting the injected interface.
	// eslint-disable-next-line no-sync
	const styletron = styletronProvider.getInstanceSync() as StyletronServer;
	const isExpectedStyletronObject = typeof styletron.getStylesheetsHtml === "function";

	if (!isExpectedStyletronObject) {
		throw new TypeError(`Dependency injection did not work as expected for styletron: ${typeof styletron} ${JSON.stringify(styletron)}`);
	}

	const reactRootHtml = ReactDOMServer.renderToString(rootElement);
	// TODO: also render language text direction, in particular dir="rtl".
	const translationLocale = localeProvider.getTranslationLocale();
	const stylesForHead = styletron.getStylesheetsHtml();
	const prerenderedState = store.getState();

	// WARNING: See the following for security issues around embedding JSON in HTML:
	// https://redux.js.org/usage/server-rendering#security-considerations
	const prerenderedStateJson = JSON.stringify(prerenderedState).replaceAll("<", "\\u003c");

	const data = {
		locale: translationLocale,
		prerenderedStateJson,
		reactRootHtml,
		stylesForHead,
	};
	const html = reactHtmlTemplateLocalsVariables(data);

	return html;
};

export default renderReactHtml;
