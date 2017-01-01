<p align="center">
  <a href="https://github.com/joelpurra/talkie"><img src="resources/icon/icon-play/icon-128x128.png" alt="Talkie logotype, a speech bubble with a play button inside" width="128" height="128" border="0" /></a>
</p>
<h1 align="center">
  <a href="https://github.com/joelpurra/talkie">Talkie</a>
</h1>
<p align="center">
  Text-to-speech browser extension button
</p>
<p align="center">
  <a href="https://chrome.google.com/webstore/detail/talkie/enfbcfmmdpdminapkflljhbfeejjhjjk"><img src="resources/chrome-web-store/ChromeWebStore_Badge_v2_340x96.png" alt="Talkie is available for installation from the Chrome Web Store" width="340" height="96" border="0" /></a>
</p>



# Developer documentation

- Use the `develop` branch as the base for your pull request.
- Follow git-flow, preferably using  [`git-flow`](http://danielkummer.github.io/git-flow-cheatsheet/).
- It is recommended to use [`hub`](https://hub.github.com/) for forking and creating pull requests on github.
- All project contributors need to agree to the the [Contributor License Agreement (CLA)](../CLA.md).



## Manual installation

- Clone the repository.
- From the Google Chrome extensions settings page:
  - Enable developer mode.
  - Load the repository folder as an unpacked extension.



## Debugging

- From the Google Chrome extensions settings page:
  - Inspect the Talkie background page view to see console output.
  - Optionally add breakpoints in the source code.



## Development

```bash
# Go to the directory where you cloned the repository.
cd talkie

# Install local development tools.
npm install

# Fix any warnings and errors before committing.
npm run --silent test
```



## Translations

- Translations can be done by editing or adding `messages.json` for the desired locale in the `_locales` directory.
- In case of doubt, please refer to `_locales/en/messages.json` as the one source of truth when it comes to message strings and descriptions.



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

# Code your feature and add the files.

# Fix any warnings and errors before committing.
npm run --silent test

# Commit your changes. Use a descriptive commit message, preferably with more than one line of text.
git commit

# Finish the feature.
git flow feature finish <feature-name>

# Publish the feature to your fork.
git flow feature publish <feature-name>

# Go to the repository page to create a pull request against the develop branch.
hub browse
```



## Release procedure

These steps are only done by the project owner.

```bash
# Finish up any features, switch to develop.
git checkout develop

# Fix any warnings and errors before committing.
npm run --silent test

# The "<release-version>" needs to follow semantic versioning, such as "v1.0.0".
# http://semver.org/
git flow release start <release-version>

# Update files to contain the version number.
npm run --silent version:update

# Finish the release and sign the tag.
git flow release finish -s <release-version>

# Create a zip file with the extension package.
npm run --silent package

# Upload and publish the package.
npm run --silent chromestore
```



---

<a href="https://github.com/joelpurra/talkie"><img src="resources/icon/icon-play/icon-16x16.png" alt="Talkie play button" width="16" height="16" border="0" />Talkie</a> Copyright &copy; 2016 [Joel Purra](https://joelpurra.com/). Released under [GNU General Public License version 3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl.html).
