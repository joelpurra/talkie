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

import options from "@talkie/options-renderer/options-html";
import popup from "@talkie/popup-renderer/popup-html";
import {
	IRenderReactHtmlToFile,
} from "@talkie/renderer/render-types";
import {
	Action,
} from "redux";

const getAllApps = async <S, A extends Action, P>(): Promise<Array<IRenderReactHtmlToFile<S, A, P>>> => {
	// NOTE: generic typing might be problematic when mixing several applications, as their state/actions/props are not the same (albeit superficially similar, sharing the same codebase).
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderReactHtmlApps: Array<IRenderReactHtmlToFile<any, any, any>> = [
		popup,
		options,
	];

	return renderReactHtmlApps;
};

export default getAllApps;
