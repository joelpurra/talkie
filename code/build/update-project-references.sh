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

declare -r JQ_TSCONFIG_SET_REFERENCE_PATHS='
. as $d
| $tsconfig[0]
| .references = (
	(
		$d
		| map(
			{
				path: ("../\(.)/tsconfig.json")
			}
		)
	)
	| sort_by(.path)
)
'

declare -r JQ_JSON_TO_DOT='
"digraph \"talkie\" {\n  rankdir=LR;\n"
+ (
	to_entries
	| map(
		.key as $p
		| "\n  \"\($p)\";\n"
		+ (
			.value
		| map("  \"\($p)\" -> \"\(.)\";\n")
		| join(""))
	)
	| join("")
)
+ "\n}"
'

declare -r JQ_GET_TALKIE_PACKAGE_NAMES='
split("\n")
| map(select(length > 0))
| reduce .[] as $l (
	[];
	if $l | startswith("@talkie/")
	then
		.[-1].d += [
			$l
			| split("@talkie/")[1]
		]
	else
		. + [
				{
					p:$l,
					d:[]
				}
			]
	end
)
| map({(.p):.d})
| add
'

declare -r JQ_UPDATE_TALKIE_DEPENDENCIES='
. as $d
| $package[0]
| .dependencies |= (
	(
		$d
		| map(
			{
				("@talkie/\(.)"): "*"
			}
		)
		| add
	)
	+ (
		( . // {} )
		| with_entries(
			select(.key
			| startswith("@talkie/")
			| not
		)
	)
)
| to_entries
| sort_by(.key)
| from_entries)
'

declare -r JQ_GET_TALKIE_DEPENDENCY_TREE='
map(
	{
		(.name | split("@talkie/")[1]): (
			.dependencies
			| to_entries
			| map(
				select(
					.key
				| startswith("@talkie/")
				)
			)
			| map(
				.key
				| split("@talkie/")[1]
			)
		)
	}
)
| add
'

declare -r JQ_PACKAGEJSON_SET_TALKIE_WORKSPACE_PATHS='
. as $d
| $package[0]
| .workspaces = (
	(
		$d
		| keys
		| map(
			"./packages/\(.)/"
		)
	)
	| sort
)
'

declare -r JQ_TSCONFIG_SET_TALKIE_PACKAGE_PATHS='
. as $d
| $tsconfig[0]
| .compilerOptions.paths = (
	(
		$d
		| keys
		| map(
			{
				(
					"@talkie/\(.)/*"
				): [
					"./packages/\(.)/src/*"
				]
			}
		)
	)
	| add
	| to_entries
	| sort_by(.key)
	| from_entries
)
'

function updateTsconfigReferences() {
	local -r filename="$1"
	shift

	jq --raw-output 'keys | .[]' "${DIST_GRAPH_FOLDER}/talkie.packages.import.json" \
	| (
		while read PACKAGE_NAME;
		do
			if [[ ! -f "./${PACKAGE_NAME}/tsconfig.json" ]];
			then
				continue;
			fi

			jq --arg PACKAGE_NAME "$PACKAGE_NAME" '.[$PACKAGE_NAME]' "${DIST_GRAPH_FOLDER}/talkie.packages.import.json" \
			| jq --slurpfile tsconfig "${PACKAGE_NAME}/tsconfig.json" "$JQ_TSCONFIG_SET_REFERENCE_PATHS" > "${PACKAGE_NAME}/tsconfig.json~"

			mv "${PACKAGE_NAME}/tsconfig.json~" "${PACKAGE_NAME}/tsconfig.json"
		done
	)
}

function resolvePath() {
	# TODO: reuse shared functions.
	realpath --logical --physical --canonicalize-existing "$@"
}

function main() {
	(
		pushd "$ROOT_FOLDER" > /dev/null

		mkdir -p "$DIST_GRAPH_FOLDER"

		(
			pushd 'packages' > /dev/null

			(
				find . -mindepth 1 -maxdepth 1 -type d \
				| sed 's_./__' \
				| sort \
				| xargs -I'{}' sh -c "echo; echo '{}'; { ag --nofilename --only-matching '(import|from) \"@talkie/[^/\"]+' ./{}/ | sed -E 's_^(import|from) \"(@talkie/[^/\"]*)\$_\2_'| sort | uniq; }" \
				| jq --raw-input --slurp "$JQ_GET_TALKIE_PACKAGE_NAMES" \
				> "${DIST_GRAPH_FOLDER}/talkie.packages.import.json"

				jq --raw-output "$JQ_JSON_TO_DOT" "${DIST_GRAPH_FOLDER}/talkie.packages.import.json" > "${DIST_GRAPH_FOLDER}/talkie.packages.import.dot"

				dot -Tsvg "${DIST_GRAPH_FOLDER}/talkie.packages.import.dot" > "${DIST_GRAPH_FOLDER}/talkie.packages.import.svg"

				jq --raw-output 'keys | .[]' "${DIST_GRAPH_FOLDER}/talkie.packages.import.json" \
				| (
					while read PACKAGE_NAME;
					do
						jq --arg PACKAGE_NAME "$PACKAGE_NAME" '.[$PACKAGE_NAME]' "${DIST_GRAPH_FOLDER}/talkie.packages.import.json" \
						| jq --slurpfile package "${PACKAGE_NAME}/package.json" "$JQ_UPDATE_TALKIE_DEPENDENCIES" \
						> "${PACKAGE_NAME}/package.json~"

						mv "${PACKAGE_NAME}/package.json~" "${PACKAGE_NAME}/package.json"
					done
				)

				updateTsconfigReferences 'tsconfig.json'

				find . -mindepth 2 -maxdepth 2 -name 'package.json' \
				| sort \
				| xargs cat \
				| jq --slurp "$JQ_GET_TALKIE_DEPENDENCY_TREE" \
				> "${DIST_GRAPH_FOLDER}/talkie.packages.dot.json"

				jq --raw-output "$JQ_JSON_TO_DOT" "${DIST_GRAPH_FOLDER}/talkie.packages.dot.json" > "${DIST_GRAPH_FOLDER}/talkie.packages.dot"

				dot -Tsvg "${DIST_GRAPH_FOLDER}/talkie.packages.dot" > "${DIST_GRAPH_FOLDER}/talkie.packages.svg"
			)

			popd > /dev/null
		)

		popd > /dev/null
	)

	{
		jq '.' "${DIST_GRAPH_FOLDER}/talkie.packages.import.json" \
		| jq --slurpfile package 'package.json' "$JQ_PACKAGEJSON_SET_TALKIE_WORKSPACE_PATHS" \
		> 'package.json~'

		mv 'package.json~' 'package.json'
	}

	{
		jq '.' "${DIST_GRAPH_FOLDER}/talkie.packages.import.json" \
		| jq --slurpfile tsconfig 'tsconfig.json' "$JQ_TSCONFIG_SET_TALKIE_PACKAGE_PATHS" \
		> 'tsconfig.json~'

		mv 'tsconfig.json~' 'tsconfig.json'
	}

	# NOTE: jq and prettier do not agree on JSON formatting, so preemptively format checked in files potentially affected by this script. This should reduce linting warnings.
	{
		find . -mindepth 1 -maxdepth 1 \( -iname 'tsconfig*.json' -or -iname 'package.json' \)
		find ./packages -mindepth 2 -maxdepth 2 \( -iname 'tsconfig*.json' -or -iname 'package.json' \)
	} \
	| sort \
	| xargs ./node_modules/.bin/prettier --log-level 'warn' --write
}

# TOOD: scope script-global variables, pass values.
declare -r SCRIPT_FOLDER="${BASH_SOURCE%/*}"
declare -r ROOT_FOLDER="$(resolvePath "${SCRIPT_FOLDER}/..")"
declare -r DIST_GRAPH_FOLDER="${ROOT_FOLDER}/dist/graph"

main "$@"