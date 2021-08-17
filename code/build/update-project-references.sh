#!/usr/bin/env bash

# This file is part of Talkie -- text-to-speech browser extension button.
# <https://joelpurra.com/projects/talkie/>
#
# Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>
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

function updateTsconfigReferences() {
	local -r filename="$1"
	shift

	jq --raw-output 'keys | .[]' 'talkie.packages.import.json' | (
		while read p;
		do
			if [[ ! -f "./${p}/tsconfig.json" ]];
			then
				continue;
			fi

			(
				pushd "$p" > /dev/null

				jq --arg p "$p" '.[$p]' '../talkie.packages.import.json' | jq --slurpfile tsconfig 'tsconfig.json' '. as $d | $tsconfig[0] | .references = (($d | map({path: ("../\(.)/tsconfig.json")})) | sort_by(.path))' > 'tsconfig.json~'

				mv 'tsconfig.json~' 'tsconfig.json'
			)
		done
	)
}

(
	declare -r SCRIPT_FOLDER="${BASH_SOURCE%/*}"
	declare -r ROOT_FOLDER="${SCRIPT_FOLDER}/.."

	pushd "$ROOT_FOLDER" > /dev/null

	(
		pushd 'packages' > /dev/null

		declare -r jsonToDot='"digraph \"talkie\" {\n  rankdir=LR;\n" + (to_entries | map(.key as $p | "\n  \"\($p)\";\n" +(.value | map("  \"\($p)\" -> \"\(.)\";\n") | join(""))) | join("")) +"\n}"'

		find . -mindepth 1 -maxdepth 1 -type d | sed 's_./__' | sort | xargs --replace='{}' sh -c "echo; echo '{}'; { ag --nofilename --only-matching 'from \"@talkie/[^/\"]+' ./{}/ | grep --invert-match 'SPLIT_ENVIRONMENT' | sed 's_from \"\(@talkie/[^/\"]*\).*_\1_'| sort | uniq; }" | jq --raw-input --slurp 'split("\n") | map(select(length > 0)) | reduce .[] as $l ([]; if $l | startswith("@talkie/") then .[-1].d+=[$l | split("@talkie/")[1]] else . + [{p:$l,d:[]}] end ) | map({(.p):.d}) | add' > 'talkie.packages.import.json'

		jq --raw-output "$jsonToDot" 'talkie.packages.import.json' > 'talkie.packages.import.dot'

		dot -Tsvg 'talkie.packages.import.dot' > 'talkie.packages.import.svg'

		jq --raw-output 'keys | .[]' 'talkie.packages.import.json' | ( while read p; do ( pushd "$p" > /dev/null; jq --arg p "$p" '.[$p]' '../talkie.packages.import.json' | jq --slurpfile package 'package.json' '. as $d | $package[0] | .dependencies |= (($d | map({("@talkie/\(.)"):"*"}) | add) + ((. // {}) | with_entries(select(.key | startswith("@talkie/") | not))) | to_entries | sort_by(.key) | from_entries)' > 'package.json~' && mv 'package.json~' 'package.json' ; ) done; )

		updateTsconfigReferences 'tsconfig.json'
		updateTsconfigReferences 'tsconfig.cjs.json'
		updateTsconfigReferences 'tsconfig.esm.json'

		find . -mindepth 2 -maxdepth 2 -name 'package.json' | sort | xargs cat | jq --slurp 'map({(.name | split("@talkie/")[1]): (.dependencies | to_entries | map(select(.key | startswith("@talkie/"))) | map(.key | split("@talkie/")[1]))}) | add' > 'talkie.packages.dot.json'

		jq --raw-output "$jsonToDot" 'talkie.packages.dot.json' > 'talkie.packages.dot'

		dot -Tsvg 'talkie.packages.dot' > 'talkie.packages.svg'

		popd > /dev/null
	)

	popd > /dev/null
)

jq '.' './packages/talkie.packages.import.json' | jq --slurpfile tsconfig 'tsconfig.json' '. as $d | $tsconfig[0] | .paths = (($d | keys | map({("@talkie/\(.)"): "./packages/\(.)/src"})) | add | to_entries | sort_by(.key) | from_entries)' > 'tsconfig.json~' && mv 'tsconfig.json~' 'tsconfig.json'

# NOTE: jq and prettier do not agree on JSON formatting, so preemptively format checked in files potentially affected by this script. This should reduce linting warnings.
{
	find . -mindepth 1 -maxdepth 1 -\( -iname 'tsconfig*.json' -or -iname 'package.json' -\)
	find ./packages -mindepth 2 -maxdepth 2 -\( -iname 'tsconfig*.json' -or -iname 'package.json' -\)
} | sort | xargs ./node_modules/.bin/prettier --loglevel 'warn' --write
