#!/usr/bin/env bash

# This file is part of Talkie -- text-to-speech browser extension button.
# <https://joelpurra.com/projects/talkie/>
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
declare UNTRANSLATED="${ROOT_FOLDER}/_locales/en/untranslated.json"
declare UNTRANSLATED_PREMIUM="${ROOT_FOLDER}/_locales/en/untranslated.premium.json"

function mergeMessages() {
    local -r INPUT="$1"

    # Merge translation files/json objects.
    # NOTE: If there's a key/name collision, the last object wins. This allows for overrides.
    # NOTE: discards translation fields other than message, description, placeholders.
    jq --slurp --sort-keys 'map(with_entries( { key: .key, value: (.value | { message: .message } + if .description then { description: .description } else {} end + if .placeholders then { placeholders: .placeholders } else {} end ) } )) | add' "$INPUT"
}

for LOC in $LOCS;
do
    LOCNAME="${LOC##*/}"
    echo "$LOC" "$LOCNAME"

    declare BASE="${LOC}/base.json"
    declare AUTOMATIC="${LOC}/automatic.json"
    declare MANUAL="${LOC}/manual.json"
    declare OVERRIDE="${LOC}/override.json"
    declare MERGE="${LOC}/merge.json~"
    declare MERGE_PREMIUM="${LOC}/merge.premium.json~"
    declare MESSAGES="${LOC}/messages.json"
    declare MESSAGES_PREMIUM="${LOC}/messages.premium.json"

    rm -f "$MERGE"
    touch "$MERGE"

    cat "$UNTRANSLATED" >> "$MERGE"

    # NOTE: this will only apply to the english base file.
    # Needed to complete en/messages.json
    if [[ -f "$BASE" ]];
    then
        cat "$BASE" >> "$MERGE"
    fi

    # NOTE: translations in $AUTOMATIC are done in another script.
    if [[ ! -f "$BASE" ]];
    then
        cat "$AUTOMATIC" >> "$MERGE"
    fi

    if [[ -f "$MANUAL" ]];
    then
        cat "$MANUAL" >> "$MERGE"
    fi

    if [[ -f "$OVERRIDE" ]];
    then
        cat "$OVERRIDE" >> "$MERGE"
    fi

    # NOTE: standard version.
    mergeMessages "$MERGE" > "$MESSAGES"

    # NOTE: premium version.
    cp "$MERGE" "$MERGE_PREMIUM"
    cat "$UNTRANSLATED_PREMIUM" >> "$MERGE_PREMIUM"

    mergeMessages "$MERGE_PREMIUM" > "$MESSAGES_PREMIUM"

    # Display the output.
    jq '.' "$MESSAGES"
done
