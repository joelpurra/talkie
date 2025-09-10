<p align="center">
  <a href="https://joelpurra.com/projects/talkie/"><img src="./code/packages/shared-resources/src/resources/tile/free/920x680/2017-08-22.png" alt="Talkie logotype, a speech bubble with a play button inside" width="460" height="340" border="0" /></a>
</p>
<h1 align="center">
  <a href="https://joelpurra.com/projects/talkie/">Talkie</a>
</h1>
<p align="center">
  Text-to-speech (TTS) browser extension button
</p>

<table>
  <tr>
    <td align="center">
      <a href="https://chrome.google.com/webstore/detail/enfbcfmmdpdminapkflljhbfeejjhjjk"><img src="./code/packages/shared-resources/src/resources/chrome-web-store/HRs9MPufa1J1h5glNhut.png" alt="Talkie is available for installation from Chrome Web Store" width="248" height="75" border="0" /><br /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" /> Talkie</a><br />&nbsp;
    </td>
    <td align="center">
      <a href="https://addons.mozilla.org/en-US/firefox/addon/talkie/"><img src="./code/packages/shared-resources/src/resources/firefox-amo/get-the-addon-fx-apr-2020.min.svg" alt="Talkie is available for installation from Chrome Web Store" width="172" height="60" border="0" /><br /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" /> Talkie</a><br />&nbsp;
    </td>
  </tr>
</table>

## Installation

- [Install Talkie from Google Chrome Web Store](https://chrome.google.com/webstore/detail/enfbcfmmdpdminapkflljhbfeejjhjjk) when using:
  - Google Chrome
  - Microsoft Edge
  - Brave, Chromium, Vivaldi, etcetera.
- [Install Talkie from Mozilla Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/talkie/) when using:
  - Mozilla Firefox

Developer option: [use the source code](./code/) directly.

## Talkie Premium

- <img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" /> **Talkie:** free to use as much as you like
- <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium's icon" width="16" height="16" border="0" /> **Talkie Premium:** donate _what you want_ for [more options and features](#features)

You _choose_ how much you want to donate for Talkie Premium, depending on how much the additional features are worth to you. You can even choose to donate nothing.

1. Install Talkie in your browser.
1. Enable Talkie Premium on the features tab in Talkie's options.
1. _Before_ you donate, make sure you are happy with all that Talkie Premium can offer.
1. Donate from the features tab in Talkie's options.

## Install additional voices

New TTS voices, languages, dialects can be downloaded **for free** from for example Microsoft, Google, Apple. Restart your computer after adding voices; afterwards Talkie should auto-detect and list them in the voice options.

You can [test installed TTS voices in the live demo](https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/) by Mozilla Developer Network (MDN).

<!-- TODO: translate system settings paths. -->

| Operating&nbsp;system                                                                                                                                    | Where to look                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [Windows&nbsp;11](https://support.microsoft.com/en-us/windows/appendix-a-supported-languages-and-voices-4486e345-7730-53da-fcfe-55cc64300f01)            | Settings &rarr;&nbsp;Time&nbsp;&amp;&nbsp;Language &rarr;&nbsp;Language&nbsp;&amp;&nbsp;Region &rarr;&nbsp;Add&nbsp;a&nbsp;language |
| [Windows&nbsp;10](https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3) | Settings &rarr;&nbsp;Time&nbsp;&amp;&nbsp;Language &rarr;&nbsp;Language &rarr;&nbsp;Add&nbsp;a&nbsp;language                        |
| [Windows&nbsp;8](https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-4c83a8d8-7486-42f7-8e46-2b0fdf753130)     | Control&nbsp;Panel &rarr;&nbsp;Language &rarr;&nbsp;Add&nbsp;a&nbsp;Language                                                        |
| [Windows&nbsp;7](https://www.microsoft.com/en-us/download/details.aspx?id=27224)                                                                         |                                                                                                                                     |
| [ChromeOS](https://support.google.com/accessibility/answer/11221616)                                                                                     | Settings &rarr;&nbsp;Accessibility &rarr;&nbsp;Text-to-Speech &rarr;&nbsp;Speech&nbsp;Engines                                       |
| [macOS](https://support.apple.com/kb/index?page=search&q=voiceover&includeArchived=true&locale=en_US)                                                    | System&nbsp;Settings &rarr;&nbsp;Accessibility &rarr;&nbsp;Spoken&nbsp;Content &rarr;&nbsp;System&nbsp;voice                        |
| Linux                                                                                                                                                    | Varies per distribution, packaging system, and browser.                                                                             |

Note that not all voices work with all browsers; you may try installing Talkie in another browser. In Microsoft Windows the TTS voice support is generally the best in Microsoft Edge.

<details>
<summary>Voice installation in Linux</summary>

TTS voices on Linux have varying quality; from recently developed "natural" voices to ancient "robotic" voices. Not all distributions nor browsers include TTS software, and may have no (zero) TTS voices available by default.

There are many open source alternatives for TTS software on Linux, although their integration with the operating system and browser varies. Addtitionally, the browser may be sandboxed (Flatpak, Snap, etcetera) and require separate TTS integration.

The topic is too broad to give specific voice installation instructions; please consult your systems documentation, or other sources of information.

- Stack Exchange: [Questions tagged \[text-to-speech\]](https://unix.stackexchange.com/questions/tagged/text-to-speech) at Unix &amp; Linux.
- Stack Exchange: [Questions tagged \[text-to-speech\]](https://askubuntu.com/questions/tagged/text-to-speech) at Ask Ubuntu.
- Stack Exchange: [Questions tagged \[speech-synthesis\]](https://softwarerecs.stackexchange.com/questions/tagged/speech-synthesis) at Software Recommendations.
- Stack Exchange: [How can I change the voice used by Firefox in Ubuntu?](https://askubuntu.com/questions/953509/how-can-i-change-the-voice-used-by-firefox-reader-view-narrator-in-ubuntu) at Ask Ubuntu.

</details>

## Usage

There are several convenient ways to use Talkie.

### Browser toolbar button

1. Select desired text on any web page.
1. Click the Talkie button in your browser toolbar ↗︎↗︎↗︎ <img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" />

### Right-click menu

1. Select the text, then right click on it
1. Choose <img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" /> Talkie in the menu.

The right-click menu also works in **most PDF-files** and **some special types of web pages** in the browser.

### Read from clipboard in Talkie Premium

1. Copy text to the clipboard from any program.
1. Use the "read from clipboard" shortcut key from anywhere.

You can also right-click on the <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium's icon" width="16" height="16" border="0" /> Talkie Premium button, or in an empty area of a website, and select **read from clipboard**.

### Shortcut keys

A fast, easy, and convenient option is to use Talkie's configurable keyboard shortcuts.

| Action                                  | Edition                                                                                                                                                                                                                                                                                                                                     | Windows, Linux, ChromeOS                      | macOS                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------ |
| Start/stop                              | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium's icon" width="16" height="16" border="0" hspace="4" /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" hspace="4" /> | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>  | <kbd>⌥</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> |
| Start/stop and show menu                | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium's icon" width="16" height="16" border="0" hspace="4" /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" hspace="4" /> | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> | <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> |
| Read text from clipboard in any program | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium's icon" width="16" height="16" border="0" hspace="4" />                                                                                                                                                                 | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd> | <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd> |

If the shortcut key does not work, please check that it is not already in use by another extension or program.

<details>
<summary>How to check or change the Talkie shortcut keys in Google Chrome</summary>

1. In Chrome, click [**Extensions**](chrome://extensions/) in the **Window** menu.
1. Click [**Keyboard shortcuts**](chrome://extensions/shortcuts) in the left side menu.
   > <img src="./code/packages/shared-resources/src/resources/keyboard-shortcuts/talkie-shortcuts-google-chrome-01.png" alt="Screenshot of Chrome's list of installed extensions, focusing on Talkie" title="Chrome's installed extensions" width="467" height="276" />
1. From the **Keyboard Shortcuts** window you can check or change keyboard shortcuts for all Chrome extensions and apps. You can also verify that there are no shortcut key collisions between extensions.
   > <img src="./code/packages/shared-resources/src/resources/keyboard-shortcuts/talkie-shortcuts-google-chrome-02.png" alt="Screenshot of the Keyboard Shortcuts window in Chrome, focusing on Talkie shortcuts" title="Talkie shortcuts in Chrome"  width="708" height="491" />
1. You can also reach the extensions page in Google Chrome directly with [`chrome://extensions/`](chrome://extensions/) and the keyboard shortcut configuration with [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts), but you might have to copy-paste the address manually.

</details>

<details>
<summary>How to check or change the Talkie shortcut keys in Firefox</summary>

See also the official documentation on [how to manage extension shortcuts in Firefox](https://support.mozilla.org/kb/manage-extension-shortcuts-firefox).

1. In Firefox, click [**Add-ons**](about:addons) in the **Tools** menu.
1. From the Add-ons page, click **Extensions** in the left side menu.
   > <img src="./code/packages/shared-resources/src/resources/keyboard-shortcuts/talkie-shortcuts-firefox-01.png" alt="Screenshot of Firefox's list of installed extensions, focusing on Talkie" title="Firefox's installed extensions"  width="565" height="387" />
1. At the top right of the extensions list, click **Manage Extension Shortcuts** in the **gear button menu**.
   > <img src="./code/packages/shared-resources/src/resources/keyboard-shortcuts/talkie-shortcuts-firefox-02.png" alt="Screenshot of the Manage Extension Shortcuts menu item" title="Manage extensions in Firefox"  width="701" height="293" />
1. From the **Manage Extension Shortcuts** window you can check or change extension shortcuts for all Firefox extensions. You can also verify that there are no shortcut key collisions between extensions.
   > <img src="./code/packages/shared-resources/src/resources/keyboard-shortcuts/talkie-shortcuts-firefox-03.png" alt="Screenshot of the Manage Extension Shortcuts window in Firefox, focusing on Talkie shortcuts" title="Talkie shortcuts in Firefox"  width="690" height="333" />
1. You can also reach the extensions page in Firefox directly with [`about:addons`](about:addons), but you might have to copy-paste the address manually.

</details>

## Features

| Feature                          | Edition                                                                                                                                                                                                                                                                                                                                                         | Description                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Ease-of-use**                  | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie has this feature" width="16" height="16" border="0" hspace="4" /> | Just highlight the text you want to hear, and hit play.     |
| **Unlimited text**               | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie has this feature" width="16" height="16" border="0" hspace="4" /> | Listen to short snippets or entire articles without limits. |
| **Automatic language detection** | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie has this feature" width="16" height="16" border="0" hspace="4" /> | Picks the correct language from installed voices.           |
| **Keyboard shortcuts**           | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie has this feature" width="16" height="16" border="0" hspace="4" /> | Fast, easy, configurable.                                   |
| **Privacy aware**                | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" /><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie has this feature" width="16" height="16" border="0" hspace="4" /> | No unnecessary tracking or external services.               |
| **Choose your favorite voice**   | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" />                                                                                                                                                                           | Great if you get tired of the system voice.                 |
| **Choose speed and pitch**       | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" />                                                                                                                                                                           | Adjust voices to your liking.                               |
| **Read from the clipboard**      | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" />                                                                                                                                                                           | Just copy text from anywhere in any program.                |
| **Warm, fuzzy feeling**          | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" />                                                                                                                                                                           | Support open source software by independent developers.     |
| **Free**                         | <img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie has this feature" width="16" height="16" border="0" hspace="4" />                                                                                                                                                                                      | Free to use as much as you like.                            |
| **Pay what you want**            | <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium has this feature" width="16" height="16" border="0" hspace="4" />                                                                                                                                                                           | Pay what you want.                                          |

## Notes

<details>
<summary>Web Speech API</summary>

Talkie uses your browser's built-in Web Speech API for text-to-speech (TTS), also known as Speech Synthesis.

- As the Web Speech API is implemented by your browser, your choice of browser and browser settings may affect Talkie.
- All text and speech is processed internally by your browser. While ultimately depending on your specific browser, processing is expected to be done on your own machine and not use a server.
- Sound is only produced, never recorded.

_See also:_

- [Web Speech API](https://wicg.github.io/speech-api/) at Web Incubator Community Group (WICG).
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) at Mozilla Developer Network (MDN).
- [Speech Synthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) at Mozilla Developer Network (MDN).
- [Speech synthesizer live demo](https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/) by Mozilla Developer Network (MDN).

</details>

<details>
<summary>Language detection</summary>

Not all languages are supported; consult your browser's voice documentation.

The language detection is performed in four steps, where the first valid value is chosen. If no language was detected, a notice is spoken (in English).

1. Your browser's text language detection for the selection, using word and sentence analysis.
1. The first available `lang="..."` attribute from the selected text's parent HTML elements.
1. The `lang="..."` attribute from the HTML root element of the current page (or frame).
1. Your browser's page primary language detection.

The Web Speech API can use more than one voice per language (currently over 20 for `en-US` in Google Chrome version 55), as well as modify speech rate (speed) and pitch. These options have been implemented in <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium's icon" width="16" height="16" border="0" /> Talkie Premium as a paid feature.

</details>

<details>
<summary>Installing voices</summary>

The voices for each language are provided by your browser. For this reason the list may differ depending on your browser, browser version, operating system, and any other installed extensions/software.

To see the list of languages/voices available in your specific browser, as well as speak out sample text, check the Talkie options page after installation. This is a good start in figuring out why a certain language might not be read out loud as expected.

You can install additional voices to support new languages and dialects; see separate installation instructions for your operating system.

_See also:_

- [Speech synthesiser live demo](https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/) by Mozilla Developer Network (MDN).

</details>

<details>
<summary>Acknowledgements</summary>

- Thanks to [Liron Tocker](https://liron.de/) for coming up with the name Talkie, the fancy icons, and promotional graphics (2016-12-31, 2017-04-09): <img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" /> <img src="./code/packages/shared-resources/src/resources/icon/premium/icon-play/icon-32x32.png" alt="Talkie Premium's icon" width="16" height="16" border="0" /> <img src="./code/packages/shared-resources/src/resources/icon/free/icon-stop/icon-32x32.png" alt="Talkie stop button" width="16" height="16" border="0" />
- Thanks to [Miroslava Jovičić](https://www.miroslavajovicic.com/) for the fancy user interface redesign (2017-05-29), and promotional graphics (2017-07-30, 2017-08-01).

</details>

---

<a href="https://joelpurra.com/projects/talkie/"><img src="./code/packages/shared-resources/src/resources/icon/free/icon-play/icon-32x32.png" alt="Talkie's icon" width="16" height="16" border="0" /> Talkie</a> Copyright &copy; 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 [Joel Purra](https://joelpurra.com/). Released under [GNU General Public License version 3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl.html).
