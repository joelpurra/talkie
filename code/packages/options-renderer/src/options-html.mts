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

import path from "node:path";

import type {
	Action,
} from "@reduxjs/toolkit";
import App from "@talkie/options-application/containers/app.js";
import rootReducer, {
	actions,
} from "@talkie/options-application/slices/index.mjs";
import {
	type OptionsRootState,
} from "@talkie/options-application/store/index.mjs";
import {
	type IRenderReactHtmlToFile,
} from "@talkie/renderer/render-types.mjs";
import {
	type ComponentProps,
} from "react";

// NOTE: relative to the compiled file being executed.
const htmlTemplatePath = new URL(
	path.join(
		"..",
		"..",
		"src",
		"options.template.html",
	),
	import.meta.url,
);

const prerenderActionsToDispatch: Action[] = [
	actions.shared.languages.loadTranslationLocale() as unknown as Action,
];
const postrenderActionsToDispatch: Action[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderReactHtml: IRenderReactHtmlToFile<OptionsRootState, any, ComponentProps<typeof App>> = {
	ChildComponent: App,
	customPostrenderActionsToDispatch: postrenderActionsToDispatch,
	customPrerenderedActionsToDispatch: prerenderActionsToDispatch,
	reactHtmlTemplatePath: htmlTemplatePath,
	rootReducer,
	templateName: "options",
};

export default renderReactHtml;
