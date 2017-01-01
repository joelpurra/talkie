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



## Installation

- **Easy option:** <a href="https://chrome.google.com/webstore/detail/talkie/enfbcfmmdpdminapkflljhbfeejjhjjk">add Talkie to Chrome</a> in the Chrome Web Store.
- Developer option: [use the source code](DEVELOP.md) directly.

## Usage

1. **Select desired text** on any web page.
1. **Click the Talkie button** in your browser bar <img src="resources/icon/icon-play/icon-16x16.png" alt="Talkie play button" width="16" height="16" border="0" />



## Features

- **Free!**
- Lets you listen to the selected text on any part of a page -- **short snippets or entire news articles**. Just highlight what you want to hear read aloud and hit play.
- Automatically **detects the text language** per-page, and chooses a voice in the same language to match it.
- **Privacy aware** -- no unnecessary tracking or external services.



## Notes

<details>
  <summary><em>Web Speech API</em></summary>

  <p>
    Uses your browser's built-in [Web Speech API for text-to-speech (TTS)](https://www.w3.org/community/speech-api/) known as [Speech Synthesis](https://dvcs.w3.org/hg/speech-api/raw-file/9a0075d25326/speechapi.html#tts-section).
  </p>

  <ul>
    <li>
      As the Web Speech API is implemented by your browser, your browser selection and settings may affect Talkie.
    </li>
    <li>
      All text and speech is processed internally by your browser. While ultimately depending on your specific browser, processing is expected to be done on your own machine and not use a server.
    </li>
    <li>
      Sound is only produced, never recorded.
    </li>
  </ul>
</details>



<details>
  <summary><em>Language detection</em></summary>

  <p>
    Not all languages are supported; consult your browser's voice documentation.
  </p>

  <p>
    The language detection is done in four steps, where the first valid value is chosen. If no language was detected, a notice is spoken (in English).
  </p>

  <ol>
    <li>
      Your browser's text language detection for the selection, using word and sentence analysis.
    </li>
    <li>
      The first available `lang="..."` attribute from the selected text's parent HTML elements.
    </li>
    <li>
      The `<html lang="...">` attribute from the current page (or frame).
    </li>
    <li>
      Your browser's page primary language detection.
    </li>
  </ol>

  <p>
    While the Web Speech API can use more than one voice per language (currently over 20 for `en-US` in Google Chrome version 55), as well as modify speech rate and pitch, these kinds of options have not been implemented. I am *considering* to develop it as a paid feature for those who install the extension through the Chrome Web Store.
  </p>
</details>



<details>
  <summary><em>Voices</em></summary>

  <p>
    The voices for each language are provided by your browser. For this reason the list may differ depending on your browser, browser version, operating system, and any other installed extensions/software.
  </p>

<details>
  <summary><em>Example list of voices available in Google Chrome version 55</em></summary>

  <p>
    The total number of voices is 83.
  </p>

  <ul>
    <li><strong>ar-SA:</strong> Tarik</li>
    <li><strong>cs-CZ:</strong> Zuzana</li>
    <li><strong>da-DK:</strong> Sara</li>
    <li><strong>de-DE:</strong> Anna, Google Deutsch</li>
    <li><strong>el-GR:</strong> Melina</li>
    <li><strong>en: Fi</strong>ona</li>
    <li><strong>en-AU:</strong> Karen</li>
    <li><strong>en-GB:</strong> Daniel, Google UK English Female, Google UK English Male</li>
    <li><strong>en-IE:</strong> Moira</li>
    <li><strong>en-IN:</strong> Veena</li>
    <li><strong>en-US:</strong> Agnes, Albert, Alex, Bad News, Bahh, Bells, Boing, Bruce, Bubbles, Cellos, Deranged, Fred, Good News, Google US English, Hysterical, Junior, Kathy, Pipe Organ, Princess, Ralph, Samantha, Trinoids, Vicki, Victoria, Whisper, Zarvox</li>
    <li><strong>en-ZA:</strong> Tessa</li>
    <li><strong>es-AR:</strong> Diego</li>
    <li><strong>es-ES:</strong> Google español, Monica</li>
    <li><strong>es-MX:</strong> Paulina</li>
    <li><strong>es-US:</strong> Google español de Estados Unidos</li>
    <li><strong>fi-FI:</strong> Satu</li>
    <li><strong>fr-CA:</strong> Amelie</li>
    <li><strong>fr-FR:</strong> Google français, Thomas</li>
    <li><strong>he-IL:</strong> Carmit</li>
    <li><strong>hi-IN:</strong> Google हिन्दी, Lekha</li>
    <li><strong>hu-HU:</strong> Mariska</li>
    <li><strong>id-ID:</strong> Damayanti, Google Bahasa Indonesia</li>
    <li><strong>it-IT:</strong> Alice, Google italiano</li>
    <li><strong>ja-JP:</strong> Google 日本語, Kyoko</li>
    <li><strong>ko-KR:</strong> Google 한국의, Yuna</li>
    <li><strong>nb-NO:</strong> Nora</li>
    <li><strong>nl-BE:</strong> Ellen</li>
    <li><strong>nl-NL:</strong> Google Nederlands, Xander</li>
    <li><strong>pl-PL:</strong> Google polski, Zosia</li>
    <li><strong>pt-BR:</strong> Google português do Brasil, Luciana</li>
    <li><strong>pt-PT:</strong> Joana</li>
    <li><strong>ro-RO:</strong> Ioana</li>
    <li><strong>ru-RU:</strong> Google русский, Milena</li>
    <li><strong>sk-SK:</strong> Laura</li>
    <li><strong>sv-SE:</strong> Alva</li>
    <li><strong>th-TH:</strong> Kanya</li>
    <li><strong>tr-TR:</strong> Yelda</li>
    <li><strong>zh-CN:</strong> Google 普通话（中国大陆）, Ting-Ting</li>
    <li><strong>zh-HK:</strong> Google 粤語（香港）, Sin-ji</li>
    <li><strong>zh-TW:</strong> Google 國語（臺灣）, Mei-Jia</li>
  </ul>
</details>
</details>


## Acknowledgements

- Thanks to [Liron Tocker](http://liron.de/) for the fancy icons and promotional graphics: <img src="resources/icon/icon-play/icon-16x16.png" alt="Talkie play button" width="16" height="16" border="0" /> <img src="resources/icon/icon-stop/icon-16x16.png" alt="Talkie stop button" width="16" height="16" border="0" />



---

<a href="https://github.com/joelpurra/talkie"><img src="resources/icon/icon-play/icon-16x16.png" alt="Talkie play button" width="16" height="16" border="0" />Talkie</a> Copyright &copy; 2016 [Joel Purra](https://joelpurra.com/). Released under [GNU General Public License version 3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl.html).
