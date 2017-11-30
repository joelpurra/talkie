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
} from "../../shared/promise";

import React from "react";
import PropTypes from "prop-types";

import {
    knownEvents,
} from "../../shared/events";

//import DualLogger from "../frontend/dual-log";
//
//const dualLogger = new DualLogger("status-container.jsx");

export default function progressHoc(ComponentToWrap) {
    return class ProgressHoc extends React.Component {
        constructor(props) {
            super(props);

            this.componentCleanup = this.componentCleanup.bind(this);
            this.isListeningToBroadcasts = false;
            this.killSwitches = [];

            this.state = {
                min: 0,
                current: 0,
                max: 0,
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

        componentCleanup() {
            this.isListeningToBroadcasts = false;
            this.executeKillSwitches();
        }
        render() {
            const {
                min,
                current,
                max,
            } = this.state;

            return (
                <ComponentToWrap
                    {...this.props}
                    min={min}
                    current={current}
                    max={max}
                />
            );
        }

        updateProgress(data) {
            if (!this.isListeningToBroadcasts) {
                return;
            }

            this.setState({
                min: data.min,
                current: data.current,
                max: data.max,
            });
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
                    return this.context.broadcaster.registerListeningAction(
                        knownEvents.updateProgress,
                        (
                            /* eslint-disable no-unused-vars */actionName/* eslint-enable no-unused-vars */,
                            actionData
                        ) => this.updateProgress(actionData)
                    )
                        .then((killSwitch) => this.killSwitches.push(killSwitch));
                }
            );
        }
    };
};
