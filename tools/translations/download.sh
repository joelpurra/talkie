#!/usr/bin/env bash

# This file is part of Talkie -- text-to-speech browser extension button.
# <https://github.com/joelpurra/talkie>
#
# Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>
#
# Talkie is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Talkie is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Talkie.  If not, see <https://www.gnu.org/licenses/>.

set -e
set -u
set -o pipefail

declare -r SCRIPT_FOLDER="${BASH_SOURCE%/*}"
declare -r ROOT_FOLDER="${SCRIPT_FOLDER}/../.."

declare -a LOCS=( "$(find "${ROOT_FOLDER}/_locales" -mindepth 1 -type d)" )

declare -r EN_BASE="${ROOT_FOLDER}/_locales/en/base.json"

for LOC in $LOCS;
do
    LOCNAME="${LOC##*/}"
    echo "$LOC" "$LOCNAME"

    declare BASE="${LOC}/base.json"
    declare AUTOMATIC="${LOC}/automatic.json"

    # NOTE: translate non-english languages automatically.
    if [[ ! -f "$BASE" ]];
    then
        cat "$EN_BASE" | "${SCRIPT_FOLDER}/download-single-language.sh" "$LOCNAME" > "$AUTOMATIC"

        # Display the output.
        jq '.' "$AUTOMATIC"
    fi
done
