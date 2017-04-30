/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

import {
    promiseTry,
} from "../shared/promise";

import {
    openUrlInNewTab,
} from "../shared/urls";

import {
    getBackgroundPage,
} from "../shared/tabs";

import DualLogger from "./dual-log";

const dualLogger = new DualLogger("shared-frontend.js");

const reduceFlatten = (items, item) => {
    return items.concat(item);
};

const filterElementsWithAttributesPrefixAndGroupPerSuffix = (elements, attributePrefix) => {
    const elementsPerAttributesSuffix = elements.map((element) => {
        const attributes = Array.from(element.attributes);

        const attributesWithPrefix = attributes.filter((attribute) => {
            return attribute.name.startsWith(attributePrefix);
        });

        if (attributesWithPrefix.length === 0) {
            return null;
        }

        return attributesWithPrefix.map((attribute) => {
            const attributeObject = {
                attributeName: attribute.name,
                attributePrefix: attributePrefix,
                attributeSuffix: attribute.name.replace(attributePrefix, ""),
                element: element,
            };

            return attributeObject;
        });
    })
    .filter((attributeObject) => attributeObject !== null)
    .reduce(reduceFlatten, [])
    .reduce((attributeObjects, attributeObject) => {
        if (!attributeObjects[attributeObject.attributeSuffix]) {
            attributeObjects[attributeObject.attributeSuffix] = [];
        }

        // NOTE: only keeping the element.
        attributeObjects[attributeObject.attributeSuffix].push(attributeObject.element);

        return attributeObjects;
    },
    {});

    return elementsPerAttributesSuffix;
};

const handleElementsPerAttributePrefix = (elements, attributePrefix, handler) => promiseTry(
    () => {
        dualLogger.dualLogDebug("Start", "handleElementsPerAttributePrefix", attributePrefix);

        const suffixesAndElements = filterElementsWithAttributesPrefixAndGroupPerSuffix(elements, attributePrefix);

        dualLogger.dualLogDebug("handleElementsPerAttributePrefix", "Handleable elements", suffixesAndElements);

        const attributeSuffixes = Object.keys(suffixesAndElements);

        const attributeSuffixPromises = attributeSuffixes.map((attributeSuffix) => {
            const elementsPerSuffix = suffixesAndElements[attributeSuffix];

            const handlerPromises = elementsPerSuffix.map((element) => promiseTry(
                () => {
                    const attributeName = attributePrefix + attributeSuffix;
                    const attributeValue = element.getAttribute(attributeName);

                    if (typeof attributeValue !== "string") {
                        dualLogger.dualLogError("handleElementsPerAttributePrefix", "Invalid attribute value", [ element ], attributeName, attributeValue);

                        throw new Error(`Handleable attribute not found: ${attributeName} on ${element}`);
                    }

                    return handler(element, attributeSuffix, attributeValue)
                        .then((result) => {
                            dualLogger.dualLogDebug("Done", "handleElementsPerAttributePrefix", "Handling successful", [ element ], attributeName, attributeValue, result);

                            return result;
                        })
                        .catch((error) => {
                            dualLogger.dualLogError("handleElementsPerAttributePrefix", "Handling not successful", [ element ], attributeName, attributeValue, error);

                            throw error;
                        });
                }
            ));

            return Promise.all(handlerPromises);
        });

        return Promise.all(attributeSuffixPromises)
            .then((result) => {
                dualLogger.dualLogDebug("Done", "handleElementsPerAttributePrefix", attributePrefix);

                return result;
            })
            .catch((error) => {
                dualLogger.dualLogError("handleElementsPerAttributePrefix", attributePrefix);

                throw error;
            });
    }
);

const configureWindowContents = () => promiseTry(
    () => {
        dualLogger.dualLogDebug("Start", "configure");

        const allElements = Array.from(document.querySelectorAll(":scope *"));
        const configureAttributePrefix = "data-configure";

        const configurationHandler = (element, attributeSuffix, attributeValue) => promiseTry(
            () => {
                const target = attributeSuffix.replace(/^-/, "");
                const configurationPath = attributeValue;

                return getBackgroundPage()
                    .then((background) => background.getConfigurationValue(configurationPath))
                    .then((configured) => {
                        if (typeof configured !== "string") {
                            throw new Error(`Configuration value not found: ${configurationPath}`);
                        }

                        if (target === "") {
                            element.textContent = configured;
                        } else {
                            element.setAttribute(target, configured);
                        }

                        return;
                    });
            }
        );

        return handleElementsPerAttributePrefix(allElements, configureAttributePrefix, configurationHandler)
            .then(() => {
                dualLogger.dualLogDebug("Done", "configure");

                return undefined;
            });
    }
);

const translateWindowContents = () => promiseTry(
    () => {
        dualLogger.dualLogDebug("Start", "translate");

        const allElements = Array.from(document.querySelectorAll(":scope *"));
        const translateAttributePrefix = "data-translate";

        const translationHandler = (element, attributeSuffix, attributeValue) => promiseTry(
            () => {
                const target = attributeSuffix.replace(/^-/, "");
                const translationId = attributeValue;
                const translated = browser.i18n.getMessage(translationId);

                if (typeof translated !== "string") {
                    throw new Error(`Translated message not found: ${translationId}`);
                }

                if (target === "") {
                    element.textContent = translated;
                } else {
                    element.setAttribute(target, translated);
                }

                return;
            }
        );

        return handleElementsPerAttributePrefix(allElements, translateAttributePrefix, translationHandler)
            .then(() => {
                dualLogger.dualLogDebug("Done", "translate");

                return undefined;
            });
    }
);

const addLinkClickHandlers = () => promiseTry(
    () => {
        // https://stackoverflow.com/questions/8915845/chrome-extension-open-a-link-from-popup-html-in-a-new-tab
        // http://stackoverflow.com/a/17732667
        const links = Array.from(document.getElementsByTagName("a"));

        links.forEach((link) => {
            const location = link.href;

            // NOTE: skipping non-https urls -- presumably empty hrefs for special links.
            if (typeof location !== "string" || !location.startsWith("https://")) {
                dualLogger.dualLogDebug("addLinkClickHandlers", "Skipping non-https URL", [ link ], location);

                return;
            }

            link.onclick = (event) => {
                event.preventDefault();

                openUrlInNewTab(location);

                return false;
            };
        });
    }
);

const addOptionsLinkClickHandlers = () => promiseTry(
    () => getBackgroundPage()
        .then((background) => background.getConfigurationValue("urls.options"))
        .then((optionsUrl) => {
            // https://developer.browser.com/extensions/optionsV2#linking
            const optionsLinks = Array.from(document.querySelectorAll(":scope [href='" + optionsUrl + "'][target]"));

            optionsLinks.forEach((optionsLink) => {
                optionsLink.onclick = (event) => {
                    event.preventDefault();

                    browser.runtime.openOptionsPage();

                    return false;
                };
            });

            return undefined;
        })
);

const checkVersion = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.isPremiumVersion())
            .then((isPremium) => {
                if (isPremium) {
                    document.body.classList.add("talkie-premium");
                } else {
                    document.body.classList.add("talkie-free");
                }

                return undefined;
            });
    }
);

const reflow = () => promiseTry(
    () => {
        document.body.style.marginBottom = "0";
    }
);

export const eventToPromise = (eventHandler, event) => promiseTry(
    () => {
        try {
            dualLogger.dualLogDebug("Start", "eventToPromise", event.type, event);

            Promise.resolve()
                .then(() => eventHandler(event))
                .then((result) => dualLogger.dualLogDebug("Done", "eventToPromise", event.type, event, result))
                .catch((error) => dualLogger.dualLogError("eventToPromise", event.type, event, error));
        } catch (error) {
            dualLogger.dualLogError("eventToPromise", event.type, event, error);

            throw error;
        }
    }
);

const focusFirstLink = () => promiseTry(
    () => {
        const firstLinkElement = document.getElementsByTagName("a")[0];

        firstLinkElement.focus();
    }
);

export const startFrontend = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => Promise.all([
                checkVersion(),
                configureWindowContents(),
                translateWindowContents(),
            ]))
            .then(() => Promise.all([
                addLinkClickHandlers(),
                addOptionsLinkClickHandlers(),
                focusFirstLink(),
                reflow(),
            ]));
    }
);

export const stopFrontend = () => promiseTry(
    () => {
        // TODO: unregister listeners.
    }
);

// https://stackoverflow.com/questions/1219860/html-encoding-lost-when-attribute-read-from-input-field
export const htmlEscape = (str) => {
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\//g, "&#x2F;");
};

// https://stackoverflow.com/questions/1219860/html-encoding-lost-when-attribute-read-from-input-field
export const htmlUnescape = (str) => {
    return str
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&#x2F;/g, "/");
};
