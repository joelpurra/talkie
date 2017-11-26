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

export const textColor = "#000000";

export const text = {
    color: textColor,
};

export const linkHighlightColor = "#3497ff";

export const highlight = {
    color: linkHighlightColor,
};

export const a = {
    color: textColor,
    ":focus": highlight,
    ":hover": highlight,
    ":active": highlight,
};

export const h1 = {};
export const h2 = {};
export const h3 = {};
export const h4 = {};
export const h5 = {};

export const kbd = {
    display: "inline-block",
    color: "#555",
    verticalAlign: "middle",
    padding: "0.1em",
    paddingLeft: "0.3em",
    paddingRight: "0.3em",
    backgroundColor: "#fcfcfc",
    border: "solid 1px #ccc",
    borderBottomColor: "#bbb",
    borderRadius: "0.3em",
    boxShadow: "inset 0 -1px 0 #bbb",
    fontFamily: "Helvetica, Verdana, sans-serif",
};

export const blockquote = {
    background: "#fafafa",
    borderLeft: "0.5em solid #cccccc",
    marginLeft: "0.5em",
    marginTop: "1em",
    marginBottom: "1em",
    padding: "0.5em",
};
