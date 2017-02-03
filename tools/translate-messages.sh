#!/usr/bin/env bash

set -e
set -u
set -o pipefail

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

# Based on code by jrdriscoll. That code copyright (c) 2015 jrdriscoll.
# https://github.com/stedolan/jq/issues/147#issuecomment-151115023

declare MESSAGESTMP="messages.json~"

declare -r LOCNAME="$1"
shift

# need objects on single line for subsequent paste to work
# paste is effectively joining on implicit key = line_number

cat - \
    | jq --compact-output '.' >"$MESSAGESTMP"

# convert contained dates to pipe separated string in jq
# convert to space separated epochs in awk
# paste json objects, corresponding epochs onto single line
# read the epochs after each object with input
# note that the test for type not string also removes nulls

export LOCNAME

# TODO: define replaced characters better.
# TODO: fix complete hacks for:
#  - single quotes (')
#  - already escaped (doubled) dollar signs ($$)

# TODO: use '\0' instead of '\n' or '|' as the message separator.

cat "$MESSAGESTMP" \
    | jq --raw-output '
        to_entries
        | map(.value.message)
        | .[]
        | gsub("[$]{2}"; "_______")
      ' \
    | parallel --pipe --group --keep-order --jobs 2 -N 1 "trans -brief -width 10000 -source en -target $LOCNAME" \
    | sed 's/^\(.*\)$/"\1"/' \
    | tr '\n' '\t' \
    | paste -d '	' "$MESSAGESTMP" - \
    | jq '
        to_entries
        | map(
            .value.message as $originalMessage
            | .value += {
                original: $originalMessage,
                message: (
                    input
                    | gsub("^\\s+"; "")
                    | gsub("\\s+$"; "")
                    | gsub("_______"; "USD ")
                    | gsub(" / "; "/")
                    | gsub("talkie"; "Talkie"; "i")
                )
            }
        )
        | from_entries
    ' \
    | jq '.'

rm -f "$MESSAGESTMP" >&2
