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

const logError = (...args) => {
    const now = new Date().toISOString();

    console.error(now, extensionName, ...args);
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

            return resolve(synthesizer);
        };

        const handleError = (event) => {
            delete synthesizer.onerror;
            delete synthesizer.onvoiceschanged;

            return reject();
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

            return setIconModePaused()
            .then(() => resolve());
        };

        const handleError = (event) => {
            delete utterance.onend;
            delete utterance.onerror;

            log("Error", `Speak text (length ${text.length})`, event);

            return setIconModePaused()
            .then(() => resolve());
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

const detectPageLanguage = () => new Promise(
    (resolve, reject) => {
        chrome.tabs.detectLanguage((language) => {
            // https://developer.chrome.com/extensions/tabs#method-detectLanguage
            log("detectLanguage", language);

            // language default value is "und".
            if (!language || typeof language !== "string" || language === "und") {
                return null;
            }

            return resolve(language);
        });
    }
);

const getFramesSelectionTextAndLanguage = () => new Promise(
    (resolve, reject) => {
        const getTabVariablesCode = `var t = { text: document.getSelection().toString(), language: document.getElementsByTagName("html")[0].getAttribute("lang") }; t`;

        chrome.tabs.executeScript(
            {
                allFrames: true,
                matchAboutBlank: true,
                code: getTabVariablesCode,
            },
            (results) => resolve(results)
        );
    }
);

const speakSelection = (synthesizer) => new Promise(
    (resolve, reject) => {
        try {
            log("Start", "Speaking selection");

            const speakAllSelections = (selections = [], detectedPageLanguage = null) => {
                log("Start", "Speaking all selections");

                log("Variable", `selections (length ${selections && selections.length || 0}) ${selections}`);

                let result = [];

                result = selections.map((selection) => {
                    log("Text", "Speaking selection:", selection);

                    const text = selection.text;
                    const language = selection.language || detectedPageLanguage || null;

                    log("Language", language);

                    return speak(synthesizer, text, language);
                });

                log("Done", "Speaking all selections");

                return result;
            };

            log("Done", "Speaking selection");

            return resolve(Promise.all(
                [
                    getFramesSelectionTextAndLanguage(),
                    detectPageLanguage(),
                ]
            )
            .then(([framesSelectionTextAndLanguage, detectedPageLanguage]) => {
                return speakAllSelections(framesSelectionTextAndLanguage, detectedPageLanguage);
            }));
        } catch(error) {
            logError("speakSelection", error);

            return reject(error);
        }
    }
);

const getIconModePaths = (name) => {
    return {
        "16": `src/resource/icon/icon-${name}/icon-16x16.png`,
        "32": `src/resource/icon/icon-${name}/icon-32x32.png`,
        "48": `src/resource/icon/icon-${name}/icon-48x48.png`,
        "64": `src/resource/icon/icon-${name}/icon-64x64.png`,
        "128": `src/resource/icon/icon-${name}/icon-128x128.png`,
        "256": `src/resource/icon/icon-${name}/icon-256x256.png`,
        "512": `src/resource/icon/icon-${name}/icon-512x512.png`,
        "1024": `src/resource/icon/icon-${name}/icon-1024x1024.png`
    };
}

const setIconMode = (name) => new Promise(
    (resolve, reject) =>
    {
        log("Start", "Changing icon to", name);

        const paths = getIconModePaths(name);
        const details = {
            path: paths,
        };

        chrome.browserAction.setIcon(
            details,
            () => {
                log("Done", "Changing icon to", name);

                resolve();
            }
        );
    }
);

const setIconModePlaying = () => setIconMode("pause");
const setIconModePaused = () => setIconMode("play");

let rootChain = Promise.resolve();

const rootChainCatcher = (error) => {
    logError(error);
};

const chain = (promise) => {
    rootChain = rootChain
    .then(promise)
    .catch(rootChainCatcher);
}

chain(
    () => setup()
    .then((synthesizer) => {
        const handleIconClick = (tab) => chain(() => new Promise(
            (resolve, reject) => {
                const wasSpeaking = synthesizer.speaking;

                // Clear all old text.
                synthesizer.cancel();

                if (!wasSpeaking) {
                    return setIconModePlaying()
                    .then(() => speakSelection(synthesizer));
                }

                return setIconModePaused();
            }
        ));

        chrome.browserAction.onClicked.addListener(handleIconClick);
    })
);

log("Done", "Loading");
