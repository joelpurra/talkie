/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019 Joel Purra <https://joelpurra.com/>

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

import getHtml from "../shared/renderers/render-react-html";

import rootReducer from "./reducers";
import actions from "./actions";
import App from "./containers/app.jsx";
import htmlTemplate from "./options.template.html";

// TODO: generalize preloading?
const prerenderActionsToDispatch = [
    actions.shared.voices.loadTranslatedLanguages(),
    actions.unshared.navigation.setActiveTabId("voices"),
];
const postrenderActionsToDispatch = [];

export default (talkieLocale) => getHtml(rootReducer, prerenderActionsToDispatch, postrenderActionsToDispatch, htmlTemplate, talkieLocale, App);
