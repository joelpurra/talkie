<p align="center">
  <a href="https://joelpurra.com/projects/talkie/"><img src="./shared-resources/src/resources/tile/free/920x680/2017-08-22.png" alt="Talkie logotype, a speech bubble with a play button inside" width="460" height="340" border="0" /></a>
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
      <a href="https://chrome.google.com/webstore/detail/enfbcfmmdpdminapkflljhbfeejjhjjk"><img src="./shared-resources/src/resources/chrome-web-store/HRs9MPufa1J1h5glNhut.png" alt="Talkie is available for installation from Chrome Web Store" width="248" height="75" border="0" /><br /><img src="./shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie play button" width="16" height="16" border="0" /> Talkie</a><br />&nbsp;
    </td>
    <td align="center">
      <a href="https://addons.mozilla.org/en-US/firefox/addon/talkie/"><img src="./shared-resources/src/resources/firefox-amo/get-the-addon-fx-apr-2020.min.svg" alt="Talkie is available for installation from Chrome Web Store" width="172" height="60" border="0" /><br /><img src="./shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie play button" width="16" height="16" border="0" /> Talkie</a><br />&nbsp;
    </td>
  </tr>
</table>

# Packages

The Talkie monorepo consists of several packages in the `@talkie/` scope/namespace. See [DEVELOP.md](../../DEVELOP.md) for build steps.

## Code rollup statistics

Some packages automatically generate a report with the size of each file `rollup` included in the output. This can be used to help reduce the generated code file size, possibly by avoiding accidental inclusion of external library files.

These files are only generated locally during the build process, and not checked in to the repository. For this reason, the below links only work locally for developers.

- [`browser-background`](./browser-background/dist/metadata/stats.html)
- [`browser-localeredirect`](./browser-localeredirect/dist/metadata/stats.html)
- [`browser-stayalive`](./browser-stayalive/dist/metadata/stats.html)
- [`options-application`](./options-application/dist/metadata/stats.html)
- [`popup-application`](./popup-application/dist/metadata/stats.html)

## Dependency graphs

During the build process, dependency graphs of internal `@talkie/` packages are automatically generated. They may provide useful if there are issues regarding, for example, accidental package references or circular dependencies.

These graphs are not checked in, thus the below images are missing until the `rebuild` command/script has been executed locally.

### Package dependency graph, as `import`ed in Typescript code

[![Package dependency graph, as imported in code](./talkie.packages.import.svg)](./talkie.packages.import.svg)

### Package dependency graph, as referenced in `package.json` files

[![Package dependency graph, as referenced in package.json](./talkie.packages.svg)](./talkie.packages.svg)

---

<a href="https://joelpurra.com/projects/talkie/"><img src="./shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie play button" width="16" height="16" border="0" />Talkie</a> Copyright &copy; 2016, 2017, 2018, 2019, 2020, 2021 [Joel Purra](https://joelpurra.com/). Released under [GNU General Public License version 3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl.html).
