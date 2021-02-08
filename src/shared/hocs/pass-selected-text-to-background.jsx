/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>

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

import PropTypes from "prop-types";
import React from "react";

import {
	knownEvents,
} from "../../shared/events";

//import DualLogger from "../frontend/dual-log";
//
//const dualLogger = new DualLogger("status-container.jsx");

export default function passSelectedTextToBackgroundHoc(ComponentToWrap) {
	return class PassSelectedTextToBackgroundHoc extends React.Component {
		constructor(props) {
			super(props);

			this.componentCleanup = this.componentCleanup.bind(this);
			this.handleFocus = this.handleFocus.bind(this);
			this.enable = this.enable.bind(this);
			this.disable = this.disable.bind(this);
			this.getSelectedTextWithFocusTimestamp = this.getSelectedTextWithFocusTimestamp.bind(this);

			this.isListeningToBroadcasts = false;
			this.killSwitches = [];
			this.mostRecentUse = 0;
		}

		static contextTypes ={
			broadcaster: PropTypes.object.isRequired,
		}

		componentDidMount() {
			window.addEventListener("beforeunload", this.componentCleanup);
			window.addEventListener("focus", this.handleFocus);

			this.gotFocus();

			this.enable();
		}

		componentWillUnmount() {
			this.componentCleanup();
		}

		shouldComponentUpdate(/* eslint-disable no-unused-vars */nextProps/* eslint-enable no-unused-vars */, /* eslint-disable no-unused-vars */nextState/* eslint-enable no-unused-vars */) {
			// NOTE: always update.
			// TODO: optimize by comparing old and new props/state.
			return this.isListeningToBroadcasts;
		}

		componentCleanup() {
			window.removeEventListener("beforeunload", this.componentCleanup);
			window.removeEventListener("focus", this.handleFocus);

			this.disable();
		}

		handleFocus() {
			this.gotFocus();
		}

		gotFocus() {
			this.mostRecentUse = Date.now();
		}

		enable() {
			// TODO: properly avoid race conditions when enabling/disabling.
			if (this.isListeningToBroadcasts) {
				return;
			}

			this.registerBroadcastListeners();
			this.isListeningToBroadcasts = true;
		}

		disable() {
			// TODO: properly avoid race conditions when enabling/disabling.
			if (!this.isListeningToBroadcasts) {
				return;
			}

			this.isListeningToBroadcasts = false;
			this.executeKillSwitches();
		}

		render() {
			return (
				<ComponentToWrap
					{...this.props}
				/>
			);
		}

		getSelectedTextWithFocusTimestamp() {
			if (!this.isListeningToBroadcasts) {
				return null;
			}

			// NOTE: duplicated elsewhere in the codebase.
			/* eslint-disable no-inner-declarations */
			const executeGetFramesSelectionTextAndLanguageCode = (function () {
				try {
					function talkieGetParentElementLanguages(element) {
						return []
							.concat((element || null) && element.getAttribute && element.getAttribute("lang"))
							.concat((element || null) && element.parentElement && talkieGetParentElementLanguages(element.parentElement));
					}

					const talkieSelectionData = {
						htmlTagLanguage: ((document || null) && (document.getElementsByTagName || null) && (document.querySelectorAll("html") || null) && (document.querySelectorAll("html").length > 0 || null) && (document.querySelectorAll("html")[0].getAttribute("lang") || null)),
						parentElementsLanguages: (talkieGetParentElementLanguages((document || null) && (document.getSelection || null) && (document.getSelection() || null) && (document.getSelection().rangeCount > 0 || null) && (document.getSelection().getRangeAt || null) && (document.getSelection().getRangeAt(0) || null) && (document.getSelection().getRangeAt(0).startContainer || null))),
						text: ((document || null) && (document.getSelection || null) && (document.getSelection() || null) && document.getSelection().toString()),
					};
					return talkieSelectionData;
				} catch {
					return null;
				}
			})();
			/* eslint-enable no-inner-declarations */

			const selectedTextWithFocusTimestamp = {
				mostRecentUse: this.mostRecentUse,
				selectionTextAndLanguageCode: executeGetFramesSelectionTextAndLanguageCode,
			};

			return selectedTextWithFocusTimestamp;
		}

		executeKillSwitches() {
			// NOTE: expected to have only synchronous methods for the relevant parts.
			const killSwitchesToExecute = this.killSwitches;
			this.killSwitches = [];

			killSwitchesToExecute.forEach((killSwitch) => {
				try {
					killSwitch();
				} catch {
					try {
						// dualLogger.dualLogError("executeKillSwitches", error);
					} catch {
						// NOTE: ignoring error logging errors.
					}
				}
			});
		}

		async registerBroadcastListeners() {
			const killSwitch = await this.context.broadcaster.registerListeningAction(knownEvents.passSelectedTextToBackground, (actionName, actionData) => this.getSelectedTextWithFocusTimestamp(actionName, actionData));

			this.killSwitches.push(killSwitch);
		}
	};
}
