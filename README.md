<p align="center">
  <a href="https://github.com/joelpurra/talkie"><img src="resources/icon/icon-play/icon-128x128.png" alt="Talkie logotype, a speech bubble with a play button inside" width="128" height="128" border="0" /></a>
</p>
<h1 align="center">
  <a href="https://github.com/joelpurra/talkie">Talkie</a>
</h1>
<p align="center">
  Text-to-speech browser extension button
</p>



## Usage

1. Select desired text on any web page.
1. Click the Talkie button in your browser bar <img src="resources/icon/icon-play/icon-16x16.png" alt="Talkie play button" width="16" height="16" border="0" />



## Features

- Uses your browser's built-in [Web Speech API for text-to-speech (TTS)](https://www.w3.org/community/speech-api/) known as [Speech Synthesis](https://dvcs.w3.org/hg/speech-api/raw-file/9a0075d25326/speechapi.html#tts-section).
- Privacy aware.
  - All text and speech is processed internally by your browser. While ultimately depending on your specific browser, all processing is expected to be done on your own machine and not use a server.
  - Sound is only produced, never recorded.
- Automatically detects the text language per-page, and chooses a voice in the same language to match it.



## Notes

- As the Web Speech API is implemented by your browser, your browser and browser settings may affect Talkie.
- Not all languages are supported; consult your browser's voice documentation.
- The language detection is done in three steps, where the first valid value is chosen.
  1. Using the first available `lang="..."` attribute from the selected text's parent HTML elements.
  1. Using the `<html lang="...">` attribute from the current page (or frame).
  1. Your browser's page primary language detection.
  1. The default language, as determined by your browser's Web Speech API.
- While the Web Speech API can use more than one voice per language (currently over 20 for `en-US` in my browser), as well as modify speech rate and pitch, these kinds of options have not been implemented. I am *considering* to develop it as a paid feature for those who install the extension through the Chrome Web Store.



## Acknowledgements

- Thanks to [Liron Tocker](http://liron.de/) for the fancy icons: <img src="resources/icon/icon-play/icon-16x16.png" alt="Talkie play button" width="16" height="16" border="0" /> <img src="resources/icon/icon-stop/icon-16x16.png" alt="Talkie stop button" width="16" height="16" border="0" />



---

<a href="https://github.com/joelpurra/talkie"><img src="resources/icon/icon-play/icon-16x16.png" alt="Talkie play button" width="16" height="16" border="0" />Talkie</a> Copyright &copy; 2016 [Joel Purra](https://joelpurra.com/). Released under [GNU General Public License version 3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl.html).
