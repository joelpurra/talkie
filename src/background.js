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

const setup = () => new Promise(
    (resolve, reject) => {
        log("Start", "Setup");

        const synthesizer = window.speechSynthesis || window.webkitSpeechSynthesis || window.mozSpeechSynthesis || window.oSpeechSynthesis || window.msSpeechSynthesis;

        const handleVoicesChanged = (event) => {
            synthesizer.onerror = null;
            synthesizer.onvoiceschanged = null;

            document.onbeforeunload = (e) => {
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

            const voices = synthesizer.getVoices();

            log("Variable", "synthesizer", synthesizer);
            log("Variable", "voices", voices);

            log("Done", "Setup");

            resolve(synthesizer);
        };

        const handleError = (event) => {
            synthesizer.onerror = null;
            synthesizer.onvoiceschanged = null;

            reject();
        };

        synthesizer.onerror = reject;
        synthesizer.onvoiceschanged = handleVoicesChanged;

        log("Variable", "synthesizer", synthesizer);
    }
);

const speak = (synthesizer, text) => new Promise(
    (resolve, reject) => {
        log("Start", `Speak text (length ${text.length}): "${text}"`);

        if (synthesizer.speaking) {
            // Clear all old text.
            synthesizer.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        // utterance.lang = "en-US";
        // utterance.pitch = [0,2];
        // utterance.rate = [0,2];
        // utterance.voice = synthesizer.getVoices()[4];

        log("Variable", "utterance", utterance);

        const handleEnd = (event) => {
            utterance.onend = null;
            utterance.onerror = null;

            log("End", `Speak text (length ${text.length}) spoken in ${event.elapsedTime} milliseconds.`);

            resolve();
        };

        const handleError = (event) => {
            utterance.onend = null;
            utterance.onerror = null;

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

log("Done", "Loading");

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
    setup()
    .then((synthesizer) => {
        // const text = $$(".entry-content p").map(e => e.textContent).join("\n\n");
        const text = "Testing testing testing!";

        return speak(synthesizer, text)
        .then(() => synthesizer);
    })
    .then((synthesizer) => {
        const speakSelection = (tab) => {
            try {
                log("Start", "Speaking selection");

                const speakAllSelections = (selections) => {
                    log("Start", "Speaking all selections");

                    log("Variable", `selections (length ${selections && selections.length || 0}) ${selections}`);

                    if (selections) {
                        const text = selections.join("\n\n");

                        log("Text", "Speaking selection(s): " + text);

                        chain(speak(synthesizer, text));
                    }

                    log("Done", "Speaking all selections");

                };

                chrome.tabs.executeScript(
                    {
                        allFrames: true,
                        matchAboutBlank: true,
                        code: 'document.getSelection().toString()'
                    },
                    speakAllSelections
                );

                log("Done", "Speaking selection");
            } catch(error) {
                debugger;
            }
        };

        chrome.browserAction.onClicked.addListener(speakSelection);
    })
);
