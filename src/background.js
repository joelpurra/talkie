/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://github.com/joelpurra/talkie>

Copyright (c) 2016 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section
// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#examples-synthesis
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#Speech_synthesis
const extensionName = "Talkie";

const log = (...args) => {
    const now = new Date().toISOString();

    console.log(now, extensionName, ...args);
};

log("Start", "Loading");

const setup = () => new Promise(
    (resolve, reject) => {
        log("Start", "Setup");

        const synthesizer = window.speechSynthesis;

        const handleVoicesChanged = (event) => {
            delete synthesizer.onerror;
            delete synthesizer.onvoiceschanged;

            log("Variable", "synthesizer", synthesizer);

            const unload = (e) => {
                log("Start", "Unloading");

                if(synthesizer.speaking) {
                    // Clear all text.
                    // TODO: check if the text was added by this extension, or something else.
                    synthesizer.cancel();

                    // Reset the system to resume playback, just to be nice to the world.
                    synthesizer.resume();
                }

                log("Done", "Unloading");
            };

            document.onbeforeunload = unload;

            const voices = synthesizer.getVoices();
            log("Variable", "voices[]", voices.length, voices.map(voice => {
                return {
                    name: voice.name, lang: voice.lang,
                };
            }));

            log("Done", "Setup");

            resolve(synthesizer);
        };

        const handleError = (event) => {
            delete synthesizer.onerror;
            delete synthesizer.onvoiceschanged;

            reject();
        };

        synthesizer.onerror = reject;
        synthesizer.onvoiceschanged = handleVoicesChanged;
    }
);

const speak = (synthesizer = null, text = "", language = null) => new Promise(
    (resolve, reject) => {
        log("Start", `Speak text (length ${text.length}): "${text}"`);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        // utterance.pitch = [0,2];
        // utterance.rate = [0,2];
        // utterance.voice = synthesizer.getVoices()[4];

        log("Variable", "utterance", utterance);

        const handleEnd = (event) => {
            delete utterance.onend;
            delete utterance.onerror;

            log("End", `Speak text (length ${text.length}) spoken in ${event.elapsedTime} milliseconds.`);

            resolve();
        };

        const handleError = (event) => {
            delete utterance.onend;
            delete utterance.onerror;

            log("End", `Speak text (length ${text.length}) spoken in ${event.elapsedTime} milliseconds.`);

            resolve();
        };

        utterance.onend = handleEnd;
        utterance.onerror = handleError;

        synthesizer.speak(utterance);

        if (synthesizer.paused) {
            synthesizer.resume();
        }

        log("Variable", "synthesizer", synthesizer);

        log("Done", `Speak text (length ${text.length})`);
    }
);

let rootChain = Promise.resolve();

const rootChainCatcher = (e) => {
    log("Error", e);
};

const chain = (promise) => {
    rootChain = rootChain
    .then(promise)
    .catch(rootChainCatcher);
}

chain(
    () => setup()
    .then((synthesizer) => {
        const speakSelection = () => {
            try {
                log("Start", "Speaking selection");

                const speakAllSelections = (selections) => {
                    log("Start", "Speaking all selections");

                    log("Variable", `selections (length ${selections && selections.length || 0}) ${selections}`);

                    if (selections) {
                        selections.forEach((selection) => {
                            log("Text", "Speaking selection:", selection);

                            chain(() => speak(synthesizer, selection.text, selection.language));
                        });
                    }

                    log("Done", "Speaking all selections");
                };

                chrome.tabs.executeScript(
                    {
                        allFrames: true,
                        matchAboutBlank: true,
                        code: 'var t = { text: document.getSelection().toString(), language: document.getElementsByTagName("html")[0].getAttribute("lang") }; t'
                    },
                    speakAllSelections
                );

                log("Done", "Speaking selection");
            } catch(error) {
                log("Error", "speakSelection", error);

                debugger;
            }
        };

        const handleIconClick = (tab) => {
            // Clear all old text.
            synthesizer.cancel();

            if (!synthesizer.speaking) {
                speakSelection();
            }
        };

        chrome.browserAction.onClicked.addListener(handleIconClick);
    })
);

log("Done", "Loading");
