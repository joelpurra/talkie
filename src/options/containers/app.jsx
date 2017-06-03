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

import React from "react";
import PropTypes from "prop-types";

import {
    bindActionCreators,
} from "redux";

import {
    connect,
} from "react-redux";

import ConfigurationProvider from "../hocs/configuration-provider.jsx";

import TranslationProvider from "../hocs/translation-provider.jsx";

import Header from "../components/header.jsx";

import Main from "../components/main.jsx";

import actionCreators from "../actions";

import {
    getLanguagesFromVoices,
} from "../utils/transform-voices";

const mapStateToProps = (state) => {
    return {
        voicesCount: state.voices.voices.length,
        languagesCount: getLanguagesFromVoices(state.voices.voices).length,
        isPremiumVersion: state.metadata.isPremiumVersion,
        versionName: state.metadata.versionName,
        activeTabId: state.navigation.activeTabId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            voices: bindActionCreators(actionCreators.voices, dispatch),
            metadata: bindActionCreators(actionCreators.metadata, dispatch),
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string,
        activeTabId: PropTypes.string,
    }

    render() {
        const {
            actions,
            voicesCount,
            languagesCount,
            isPremiumVersion,
            versionName,
            activeTabId,
          } = this.props;

        return (
            <ConfigurationProvider
                getConfigurationValue={actions.metadata.getConfigurationValue}
            >
                <TranslationProvider>
                    <div>
                        <Header />

                        <Main
                            actions={actions}
                            voicesCount={voicesCount}
                            languagesCount={languagesCount}
                            isPremiumVersion={isPremiumVersion}
                            versionName={versionName}
                            activeTabId={activeTabId}
                        />
                    </div>
                </TranslationProvider>
            </ConfigurationProvider>
        );
    }
}
