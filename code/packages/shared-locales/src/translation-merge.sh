#!/usr/bin/env bash

# This file is part of Talkie -- text-to-speech browser extension button.
# <https://joelpurra.com/projects/talkie/>
#
# Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>
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

function resolvePath() {
    # TODO: reuse shared functions.
    realpath --logical --physical --canonicalize-existing "$@"
}

declare -r SCRIPT_FOLDER="${BASH_SOURCE%/*}"

declare -r PROJECT_ROOT_FOLDER="$(resolvePath "${SCRIPT_FOLDER}/..")"
declare -r LOCALES_SOURCE_ROOT_FOLDER="${PROJECT_ROOT_FOLDER}/src/data/_locales"
declare -r LOCALES_DESTINATION_ROOT_FOLDER="${PROJECT_ROOT_FOLDER}/dist/data/_locales"

declare -a LOCNAMES=(
    $(
        pushd "$LOCALES_SOURCE_ROOT_FOLDER" >/dev/null
        find . -mindepth 1 -maxdepth 1 -type d \
        | sed 's_^\./__' \
        | sort
    )
)

declare -r EN_BASE="${LOCALES_SOURCE_ROOT_FOLDER}/en/base.json"
declare UNTRANSLATED="${LOCALES_SOURCE_ROOT_FOLDER}/en/untranslated.json"

function mergeMessages() {
    local -r INPUT="$1"

    # Merge translation files/json objects.
    # NOTE: If there's a key/name collision, the last object wins. This allows for overrides.
    # NOTE: discards translation fields other than message, description, placeholders.
    jq --slurp --sort-keys 'map(with_entries( { key: .key, value: (.value | { message: .message } + if .description then { description: .description } else {} end + if .placeholders then { placeholders: .placeholders } else {} end ) } )) | add' "$INPUT"
}

for LOCNAME in ${LOCNAMES[@]}; do
    declare LOC_SOURCE_FOLDER="${LOCALES_SOURCE_ROOT_FOLDER}/${LOCNAME}"
    declare LOC_DESTINATION_FOLDER="${LOCALES_DESTINATION_ROOT_FOLDER}/${LOCNAME}"

    declare BASE="${LOC_SOURCE_FOLDER}/base.json"
    declare AUTOMATIC="${LOC_SOURCE_FOLDER}/automatic.json"
    declare MANUAL="${LOC_SOURCE_FOLDER}/manual.json"
    declare OVERRIDE="${LOC_SOURCE_FOLDER}/override.json"

    declare MERGE="${LOC_DESTINATION_FOLDER}/merge.json~"
    declare MESSAGES="${LOC_DESTINATION_FOLDER}/messages.json"

    mkdir --parents "$LOC_DESTINATION_FOLDER"

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

    rm "$MERGE"

    # NOTE: Display the output.
    #jq '.' "$MESSAGES"
done
