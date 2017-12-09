/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

const sharedList = {
    marginTop: "0.25em",
    marginBottom: "0.25em",
    paddingLeft: "2em",
};

export const ul = sharedList;
export const ol = sharedList;
export const dl = sharedList;

export const li = {
    marginBottom: "0.25em",
};

export const dt = {
    fontWeight: "bold",
    marginTop: "1em",
};
export const dd = {
    marginBottom: "0.5em",
};

const sharedInlineList = {
    listStyleType: "none",
    marginTop: "0.25em",
    marginBottom: "0.25em",
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
};

export const inlineUl = sharedInlineList;
export const inlineOl = sharedInlineList;

export const inlineLi = {
    listStyleType: "none",
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: "0.25em",
    display: "inline-block",
};
