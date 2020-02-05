/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

const layoutWithMargins = {
    marginTop: "0.5em",
    marginBottom: "0.5em",
    marginLeft: "1em",
    marginRight: "1em",
    fontSize: "0.75em",
};

export const header = layoutWithMargins;
export const main = layoutWithMargins;
export const nav = layoutWithMargins;
export const footer = layoutWithMargins;

export const hr = Object.assign(
    {},
    layoutWithMargins,
    {
        color: "#dddddd",
        borderStyle: "solid",
        borderWidth: 0,
        borderTopWidth: "1px",
    },
);

export const details = {};
export const summary = {
    cursor: "pointer",
};

export const hero = {
    borderRadius: "0.4em",
    fontSize: "2em",
    paddingLeft: "1em",
    paddingRight: "1em",
    paddingTop: "1em",
    paddingBottom: "1em",
    marginLeft: "2em",
    marginRight: "2em",
    marginTop: "2em",
    marginBottom: "2em",
    backgroundColor: "#eceff5",
};
