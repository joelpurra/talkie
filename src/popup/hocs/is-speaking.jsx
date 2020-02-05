/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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
} from "../../shared/promise";

import React from "react";
import PropTypes from "prop-types";

import {
    knownEvents,
} from "../../shared/events";

//import DualLogger from "../frontend/dual-log";
//
//const dualLogger = new DualLogger("status-container.jsx");

export default function isSpeakingHoc(ComponentToWrap) {
    return class IsSpeakingHoc extends React.Component {
        constructor(props) {
            super(props);

            this.componentCleanup = this.componentCleanup.bind(this);
            this.isListeningToBroadcasts = false;
            this.killSwitches = [];

            this.state = {
                isSpeaking: false,
            };
        }

        static contextTypes ={
            broadcaster: PropTypes.object.isRequired,
        }

        componentDidMount() {
            window.addEventListener("beforeunload", this.componentCleanup);

            this.registerBroadcastListeners();
            this.isListeningToBroadcasts = true;
        }

        componentWillUnmount() {
            window.removeEventListener("beforeunload", this.componentCleanup);

            this.componentCleanup();
        }

        shouldComponentUpdate(nextProps, nextState) {
            // NOTE: always update.
            // TODO: optimize by comparing old and new props/state.
            return this.isListeningToBroadcasts;
        }

        componentCleanup() {
            this.isListeningToBroadcasts = false;
            this.executeKillSwitches();
        }

        render() {
            const {
                isSpeaking,
            } = this.state;

            return (
                <ComponentToWrap
                    {...this.props}
                    isSpeaking={isSpeaking}
                />
            );
        }

        updateIsSpeaking(data) {
            if (!this.isListeningToBroadcasts) {
                return;
            }

            // NOTE: there seems to be some issues with react trying to re-render the page after the page has (will) unload.
            // NOTE: trigger by hitting the Talkie button in quick succession.
            // NOTE: This seems to be due to events from the background page having enough state to for the broadcaster to trigger events inside of the page, before (without) killSwitches being executed.
            // NOTE: The code inside of react is tricky -- especially in dev mode -- and this try-catch might not do anything.
            // https://github.com/facebook/react/pull/10270
            // https://github.com/facebook/react/blob/37e4329bc81def4695211d6e3795a654ef4d84f5/packages/react-reconciler/src/ReactFiberScheduler.js#L770
            // https://github.com/facebook/react/blob/46b3c3e4ae0d52565f7ed2344036a22016781ca0/packages/shared/invokeGuardedCallback.js#L151-L161
            try {
                this.setState({
                    isSpeaking: data,
                });
            } catch (error) {
                // dualLogger.dualLogError("setState", error);

                // NOTE: ignoring and swallowing error.
                return undefined;
            }
        }

        executeKillSwitches() {
            // NOTE: expected to have only synchronous methods for the relevant parts.
            const killSwitchesToExecute = this.killSwitches;
            this.killSwitches = [];

            killSwitchesToExecute.forEach((killSwitch) => {
                try {
                    killSwitch();
                } catch (error) {
                    try {
                        // dualLogger.dualLogError("executeKillSwitches", error);
                    } catch (ignored) {
                    // NOTE: ignoring error logging errors.
                    }
                }
            });
        };

        registerBroadcastListeners() {
            return promiseTry(
                () => {
                    return Promise.all([
                        /* eslint-disable no-unused-vars */
                        this.context.broadcaster.registerListeningAction(knownEvents.beforeSpeaking, (actionName, actionData) => this.updateIsSpeaking(true))
                            .then((killSwitch) => this.killSwitches.push(killSwitch)),
                        this.context.broadcaster.registerListeningAction(knownEvents.beforeSpeakingPart, (actionName, actionData) => this.updateIsSpeaking(true))
                            .then((killSwitch) => this.killSwitches.push(killSwitch)),
                        this.context.broadcaster.registerListeningAction(knownEvents.afterSpeaking, (actionName, actionData) => this.updateIsSpeaking(false))
                            .then((killSwitch) => this.killSwitches.push(killSwitch)),
                        /* eslint-enable no-unused-vars */
                    ]);
                },
            );
        }
    };
};
