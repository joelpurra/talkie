<p align="center">
  <a href="https://joelpurra.com/projects/talkie/"><img src="./code/packages/shared-resources/src/resources/tile/free/920x680/2017-08-22.png" alt="Talkie logotype, a speech bubble with a play button inside" width="460" height="340" border="0" /></a>
</p>
<h1 align="center">
  <a href="https://joelpurra.com/projects/talkie/">Talkie</a>
</h1>
<p align="center">
  Text-to-speech browser extension button
</p>
<table>
  <tr>
    <td align="center">
      <a href="https://chrome.google.com/webstore/detail/enfbcfmmdpdminapkflljhbfeejjhjjk"><img src="./code/packages/shared-resources/src/resources/chrome-web-store/ChromeWebStore_Badge_v2_496x150.png" alt="Talkie is available for installation from Chrome Web Store" width="248" height="75" border="0" /><br /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie play button" width="16" height="16" border="0" /> Talkie</a><br />&nbsp;
    </td>
    <td align="center">
      <a href="https://addons.mozilla.org/en-US/firefox/addon/talkie/"><img src="./code/packages/shared-resources/src/resources/firefox-amo/AMO-button_1.png" alt="Talkie is available for installation from Chrome Web Store" width="172" height="60" border="0" /><br /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie play button" width="16" height="16" border="0" /> Talkie</a><br />&nbsp;
    </td>
  </tr>
</table>

# Developer documentation

Talkie can be built and tested locally, using freely available open source tools.

## About the source code

- The source code itself is in the [`./code/`](./code/) directory.
  - This is a monorepo, split up to several [`packages/`](./code/packages/) in the internal (non-published) `@talkie/` scope/namespace.
  - [Dependency graphs](./code/packages/README.md) are generated at build time, to give an overview of internal package dependencies.
- The main language is [Typescript](https://www.typescriptlang.org/), with some supporting shell scripts and tooling.
- Adhere to the [GNU General Public License version 3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl.html). All project contributors need to agree to the the [Contributor License Agreement (CLA)](./CLA.md).

## Prerequisites

- Find the source code in the [Talkie repository on Github](https://github.com/joelpurra/talkie).
  - Source code is primarily distributed using `git`, so preferably clone the repository.
  - Many script commands rely on the repository and will not work for `.zip` release files with source code.
- Development should be performed on modern [Linux](https://en.wikipedia.org/wiki/Linux) or [Apple macOS](https://en.wikipedia.org/wiki/MacOS).
  - Development on [Microsoft Windows](https://en.wikipedia.org/wiki/Microsoft_Windows) is not supported.
- Script commands are executed as `npm` scripts, mostly using `node`.
  - Some script commands assume that `bash` (or a compatible shell) is used, or at least available.
  - Additional common development tools are required.
- Use the `develop` branch as the base for your pull request.
  - Follow the [git-flow development procedure](https://danielkummer.github.io/git-flow-cheatsheet/), preferably using the `git-flow` tooling.
  - It is recommended to use `hub` for forking and creating pull requests on github.

## Software requirements

The build process assumes that current stable versions of the following are available. If anything is missing from this list, please [open an issue](https://github.com/joelpurra/talkie/issues).

- [`bash`](https://www.gnu.org/software/bash/)
- [`dot`](https://www.graphviz.org/doc/info/command.html) from [Graphviz](https://www.graphviz.org/).
- [`git-flow`](https://github.com/petervanderdoes/gitflow-avh) (AVH Edition)
- [`git`](https://git-scm.com/)
- [`hub`](https://hub.github.com/)
- [`jq`](https://stedolan.github.io/jq/)
- [`node`](https://nodejs.org/) with `npm`

## Manual installation

- Clone the repository.
- Open a terminal and enter the `./code/` directory, which is the base directory for all commands unless otherwise noted.
- Build the code using the script commands below.
- From the browser extensions settings page:
  - Enable developer mode.
  - Load one of the output directories as an unpacked extension.
    - `./packages/output-webext-chrome/dist/chrome/` for Google Chrome, Chromium, Vivaldi, and similar browsers.
    - `./packages/output-webext-webextension/dist/webextension/` for Firefox, and other browsers.

## Building

```bash
# Go to the directory where you cloned the repository.
cd talkie
cd code

# Install package dependencies and local development tools.
npm install

# Do a clean build.
npm run --silent rebuild
```

## Browser testing

- Loads Talkie from the fresh build and allows for quick testing right in the browser.
- Uses a temporary (empty) browser user profile, when possible.
- Might not work on all systems; try to install/use another browser if one fails.

```bash
# Assumes you have `google-chrome`/`chromium`/`vivaldi` in your path.
cd ./packages/output-webext-chrome/
npm run --silent run:chrome
npm run --silent run:chromium
npm run --silent run:vivaldi

# Optionally use rainbow to highlight some of the Talkie log messages in the Chromium terminal output.
# https://github.com/nicoulaj/rainbow
npm run --silent run:chrome |& rainbow --red '"ERRO' --yellow '"WARN' --blue '"INFO'

# Open a new instance of Firefox, with an empty profile, and load Talkie in debugging mode.
cd ./packages/output-webext-webextension/
npm run --silent run:firefox

# You might need to set the path to Firefox on your system.
WEB_EXT_FIREFOX="${HOME}/Applications/Firefox.app/Contents/MacOS/firefox-bin" npm run --silent run:firefox
```

## Build modes

It is possible to switch the build mode between `production` (the default) and `development`. Do this by setting the `TALKIE_ENV` environment variable at build time.

Production mode:

- The publicly published version.
- Reduced default logging detail level to the developer console (see [Debugging](#debugging)).
- Uses minimized script files of dependencies, for reduced extension file size.

Development mode:

- Increased default logging detail level to the developer console.
  - Enables Redux action/state change logging.
- Uses non-minimized development versions of script files of dependencies.
- Enables [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html) to track down potential problems.

```bash
# Enable some additional debugging features.
TALKIE_ENV='development' npm run --silent rebuild
```

## Debugging

- Prefer using the [development build](#build-modes).
- From the browser extensions settings page:
  - Enable developer mode.
  - Inspect the Talkie background page view to see console output.
- It is possible to coarsely adjust the console logging level.
  - In the background page console, enter one of these logging level commands:
    - `window.talkieServices.setLoggingLevel("TRAC");` (maximum logging)
    - `window.talkieServices.setLoggingLevel("DEBG");` (default in development mode)
    - `window.talkieServices.setLoggingLevel("INFO");`
    - `window.talkieServices.setLoggingLevel("WARN");` (default in production mode)
    - `window.talkieServices.setLoggingLevel("ERRO");`
    - `window.talkieServices.setLoggingLevel("NONE");` (no logging)
- You can also inspect the popup and options pages separately, to find problems specific to those parts. Most of the logging is duplicated to the background page console for an overview.
- Optionally add breakpoints in the source code.

## Translations

In order to offer Talkie in as many languages as possible, translations are automated. It is still possible &mdash; and preferred &mdash; to add overrides with human translations.

- The `_locales` directory usually present in the root of webextensions is located in `./packages/shared-locales/src/data/_locales`. This is the base directory referenced below.
- The translation files are assembled before being copied to the webextension output packages.

### Human translations

- All message changes have to be reflected in `./_locales/en/base.json`, which is the base for all other languages.
- Translations can be done by editing or adding `override.json` for the desired locale in the `_locales` directory.
- In case of doubt, please refer to `./_locales/en/base.json` as the one source of truth when it comes to original message strings and descriptions.

### Automated file mangling

- The `messages.json` for each language is assembled by `npm run --silent messages:refresh`. It is fast enough for development change-test-change cycles.
- All English base strings in `./_locales/en/base.json` are automatically translated to all other languages by `npm run --silent messages:download`. It takes 1-3 minutes to translate all languages, and is too slow to use repeatedly during development. English is the easiest language to use during development.
- Translation scripts require a [Google Cloud Translation API key](https://cloud.google.com/translate/), [`jq`](https://stedolan.github.io/jq/manual/), and some shell magic.
- Automated file mangling is done by maintainers using `npm run --silent messages:translate` before each release where the have been text changes.

### Translation file order

Translation files are merged in this order. The last value for a specific key/name wins, which means the messages in `override.json` are the most important.

1. Non-translated strings from `./_locales/en/untranslated.json`.
1. Depends on the language; English has no modifications and uses the base:
   - Non-translated strings from `./_locales/en/base.json`.
   - Translated strings from `./_locales/*/automatic.json`.
1. Manual entries from `./_locales/*/manual.json`.
1. Overrides from `./_locales/*/override.json`.

## Pull request procedure

- These steps assume you are using the `hub` and `git-flow` tools.
- Expect to have your contribution scrutinized, so make sure your code is well-written. You may be asked to fix some stuff before your pull request is accepted.

```bash
# Fork the repository to your user on github.
hub fork

# Switch to develop.
git checkout develop

# Start a new feature. Us a descriptive "<feature-name>", such as "automatic-language-detection".
git flow feature start <feature-name>

# Watch the source files for changes. You can also run each command separately; see package.json.
npm run --silent watch

# Code your feature and add the files.
# Manually reload and test the code in the browser.
# Manually test all Talkie features:
#   - The Talkie button.
#   - Shortcut keys.
#   - Right click context menu.
#   - Options page.
#   - Language detection in more than one language.
#   - (Any features which might not have been added to this list.)
#   - (Any feature change you may have changed/added.)
# Test in the supported browsers:
#   - Google Chrome.
#   - Firefox.
#   - Preferably other browsers as well.

# Make sure the code builds.
npm run --silent rebuild

# Fix any warnings and errors before committing.
npm run --silent test

# Fix linting issues before committing.
npm run --silent lint

# Some lint can be fixed automatically.
npm run --silent lint:fix

# Commit your changes. Use a descriptive commit message, preferably with more than one line of text.
git commit

# Finish the feature.
git flow feature finish <feature-name>

# Publish the feature to your fork.
git flow feature publish <feature-name>

# Go to the repository page to create a pull request against the develop branch.
hub browse
```

## Maintaining package dependencies

Keep package dependencies up to date and synchronized across monorepo sub-packages. These commands are helpful.

```bash
# List outdated packages, or version mismatches.
npm run --silent dependencies:check

# Update packages in-range.
# NOTE: major version upgrade are handled manually.
npm run --silent dependencies:upgrade
```

## Release procedure

Packaging all extension variants for release in the different distribution channels, as well as a `.zip` file with the source code. These steps are only performed by the project owner.

```bash
# Finish up any features, switch to develop.
git checkout develop

# Ensure all strings have been translated.
# Check the diff as well as the final per-key message string count.
cd ./packages/shared-locales
npm run --silent messages:translate
cd -

# Ensure all files are included -- or excluded -- in the assembled extension output.
# This includes new code files/translations/resources added/removed since the last release.
cat ./packages/output-webext/src/package-files/code.txt
cat ./packages/output-webext/src/package-files/locales.txt
cat ./packages/output-webext/src/package-files/root.txt

# Fix any warnings and errors before committing.
npm run --silent preoutput

# The "<release-version>" needs to follow semantic versioning, such as "v1.0.0".
# https://semver.org/
git flow release start <release-version>

# Update files to contain the version number.
npm run --silent version:update

# Finish the release and sign the tag.
git flow release finish -s <release-version>

# Check out the release version tag.
git checkout <release-version>

# Create zip files with the assembled extension outputs.
npm run --silent output

# Upload and publish the output where it can be automated.
# Release to other distribution channels manually.
npm run --silent publish:chromestore
npm run --silent publish:amo
```

---

<a href="https://joelpurra.com/projects/talkie/"><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie play button" width="16" height="16" border="0" />Talkie</a> Copyright &copy; 2016, 2017, 2018, 2019, 2020, 2021 [Joel Purra](https://joelpurra.com/). Released under [GNU General Public License version 3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl.html).
