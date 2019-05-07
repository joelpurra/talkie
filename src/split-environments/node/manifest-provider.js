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

const jsonfile = require("jsonfile");

// NOTE: uses the manifest from the current working directory.
const MANIFEST_FILENAME = "manifest.json";

export default class NodeEnvironmentManifestProvider {
    constructor() {
        this.manifest = null;
    }

    getSync() {
        // NOTE: making sure it's a synchronous call.
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/getManifest
        if (this.manifest === null) {
            /* eslint-disable no-sync */
            this.manifest = jsonfile.readFileSync(MANIFEST_FILENAME);
            /* eslint-enable no-sync */
        }

        return this.manifest;
    }
}
