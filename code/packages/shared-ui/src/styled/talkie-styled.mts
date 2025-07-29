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

import {
	styled,
	type StyleObject,
	type StyletronComponent,
	withStyleDeep,
} from "styletron-react";

import {
	type TalkieStyletronComponent,
} from "./types.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export const talkieStyled = <D extends React.ElementType, S extends {} = any>
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
(component: D, style: StyleObject = {}): S extends StyleObject ? TalkieStyletronComponent<D, S> : TalkieStyletronComponent<D> =>
	styled<D, S>(component, style) as S extends StyleObject ? TalkieStyletronComponent<D, S> : TalkieStyletronComponent<D>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export const withTalkieStyleDeep = <D extends React.ElementType, S extends {} = any>
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
(component: TalkieStyletronComponent<D, S>, style: StyleObject): TalkieStyletronComponent<D> => withStyleDeep<StyletronComponent<D, S>, S>(component, style);
