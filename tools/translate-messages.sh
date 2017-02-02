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
    | jq -c '.' >"$MESSAGESTMP"

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

cat "$MESSAGESTMP" \
    | jq -r '
        to_entries
        | map(.value.message)
        | reduce .[] as $d (
            "";
            . + $d + "|"
        )
      ' \
    | sed 's/\$\$/_______/g' \
    | sed "s/I'm/I am /g" \
    | sed "s/'/======/g" \
    | gawk -F\| ' {
    for (i=1; i<NF; i++) {
        printf "\"";
        "echo " $(i)  " | trans -brief -source en -target $LOCNAME" | getline d;
        printf d;
        printf "\"";
        printf "	";
    }
    printf "\n";
    } ' \
    | sed 's/_______/USD /g' \
    | sed "s/======/'/g" \
    | sed "s_ / _/_g" \
    | sed 's/[Tt][Aa][Ll][Kk][Ii][Ee]/Talkie/g' \
    | paste -d\	 "$MESSAGESTMP" - \
    | jq '
        to_entries
        | map(
            .value += {
                message: input
            }
        )
        | from_entries
    ' \
    | jq '.'

rm -f "$MESSAGESTMP" >&2
