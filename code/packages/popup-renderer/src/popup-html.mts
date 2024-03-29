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

import type {
	Action,
} from "@reduxjs/toolkit";
import App from "@talkie/popup-application/containers/app.js";
import rootReducer from "@talkie/popup-application/slices/index.mjs";
import {
	PopupRootState,
} from "@talkie/popup-application/store/index.mjs";
import {
	IRenderReactHtmlToFile,
} from "@talkie/renderer/render-types.mjs";
import path from "node:path";
import {
	ComponentProps,
} from "react";

// NOTE: relative to the compiled file being executed.
const htmlTemplatePath = new URL(
	path.join(
		"..",
		"..",
		"src",
		"popup.template.html",
	),
	import.meta.url,
);

const prerenderActionsToDispatch: Action[] = [];
const postrenderActionsToDispatch: Action[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderReactHtml: IRenderReactHtmlToFile<PopupRootState, any, ComponentProps<typeof App>> = {
	ChildComponent: App,
	customPostrenderActionsToDispatch: postrenderActionsToDispatch,
	customPrerenderedActionsToDispatch: prerenderActionsToDispatch,
	reactHtmlTemplatePath: htmlTemplatePath,
	rootReducer,
	templateName: "popup",
};

export default renderReactHtml;
