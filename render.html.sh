#!/usr/bin/env bash

set -e
set -u
set -o pipefail

getHtmlNames() {
  (
    pushd "./dist" >/dev/null
    find . -mindepth 1 -maxdepth 1 -type f | sed -n -e '/\.html\.js$/ { s|^\./\([a-z]*\)\.html\.js$|\1| ; p ; }'
    popd >/dev/null
  )
}

getLocales() {
  (
    pushd "./_locales" >/dev/null
    find . -mindepth 1 -maxdepth 1 -type d | tr -d './'
    popd >/dev/null
  )
}

declare -r renderWorkingDirectory="$1"
shift

declare -a reactHtmlNames=($(getHtmlNames))

declare -a talkieLocales=($(getLocales))

declare rendererPath="./render.html.js"

for reactHtmlName in "${reactHtmlNames[@]}";
do
    for talkieLocale in "${talkieLocales[@]}";
    do
        declare javscriptPath="./dist/${reactHtmlName}.html.js"
        declare outfile="./${renderWorkingDirectory}/dist/${reactHtmlName}.${talkieLocale}.html"

        node "$rendererPath" "$javscriptPath" "$renderWorkingDirectory" "$talkieLocale" > "$outfile"
    done
done
