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
	TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import {
	Action,
	Reducer,
} from "@reduxjs/toolkit";

// NOTE: this type must match the "locals" variables used in the ejs html templates.
export type ReactHtmlTemplateLocalsVariables = (data: Readonly<{
	locale: TalkieLocale;
	prerenderedStateJson: string;
	reactRootHtml: string;
	stylesForHead: string;
}>) => string;

export interface IRenderReactHtml<S, A extends Action, P> {
	rootReducer: Reducer<S, A>;
	customPrerenderedActionsToDispatch: Readonly<A[]>;
	/**
	 * @deprecated Post-render actions have no effect when pre-rendering html on the server-side.
	 */
	customPostrenderActionsToDispatch: Readonly<A[]>;
	reactHtmlTemplatePath: URL;
	ChildComponent: React.ComponentType<P>;
}

export interface IRenderReactHtmlToFile<S, A extends Action, P> extends IRenderReactHtml<S, A, P> {
	templateName: string;
}

export interface IRenderReactHtmlForLocale<S, A extends Action, P> extends IRenderReactHtml<S, A, P> {
	talkieLocale: TalkieLocale;
}
