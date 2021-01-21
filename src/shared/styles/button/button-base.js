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

export const hover = {
    color: "#ffffff",
};

export const focus = {
    backgroundImage: "linear-gradient(to bottom, #087eff, #087eff)",
    color: "#ffffff",
};

export const button = {
    borderRadius: "0.3em",
    backgroundImage: "linear-gradient(to bottom, #6bb3fa, #087eff)",
    color: "#ffffff",
    paddingTop: "0.3em",
    paddingBottom: "0.3em",
    paddingLeft: "0.75em",
    paddingRight: "0.75em",
    textDecoration: "none",
    textAlign: "center",
    ":hover": hover,
    ":focus": focus,
};

export const a = button;
