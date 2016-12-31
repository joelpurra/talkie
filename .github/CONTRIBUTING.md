<p align="center">
  <a href="https://github.com/joelpurra/talkie"><img src="../resources/icon/icon-play/icon-128x128.png" alt="Talkie logotype, a speech bubble with a play button inside" width="128" height="128" border="0" /></a>
</p>
<h1 align="center">
  <a href="https://github.com/joelpurra/talkie">Talkie</a>
</h1>
<p align="center">
  Text-to-speech browser extension button
</p>



## Problems?

- Report any issues with installation, usage on specific webpages, crashes, etcetera [using the issue tracker](https://github.com/joelpurra/talkie/issues).
- Please include relevant information:
  - Which browser and version you are using.
  - Which website the problem occurred on. If possible, include the full link.
  - Which text/part of the website you want spoken.
  - Which language the text was expected to be spoken in.
  - Any other information you think might be relevant in tracking down the issue.



## Have a patch?

- Translations can be done by editing or adding `messages.json` for the desired locale in the `_locales` directory.
- Follow [git-flow](http://danielkummer.github.io/git-flow-cheatsheet/) and use the `develop` branch as the base for your patch.
- All project contributors need to agree to the the [Contributor License Agreement (CLA)](../CLA.md).



## Release procedure

```bash
# Finish up any features, switch to develop.
git checkout develop

# Fix any warnings and errors.
npm run --silent test

# The "<version>" needs to follow semantic versioning, such as "v1.0.0".
# http://semver.org/
git flow release start <version>

# Update files to contain the version number.
npm run --silent version:update

# Finish the release and sign the tag.
git flow release finish -s <version>

# Create a zip file with the extension package.
npm run --silent package

# Upload the package to publish.
```



---

<a href="https://github.com/joelpurra/talkie"><img src="../resources/icon/icon-play/icon-16x16.png" alt="Talkie play button" width="16" height="16" border="0" />Talkie</a> Copyright &copy; 2016 [Joel Purra](https://joelpurra.com/). Released under [GNU General Public License version 3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl.html).
