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

import IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider";
import ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider";
import {
	SystemType,
} from "@talkie/split-environment-interfaces/moved-here/imetadata-manager";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import {
	Provider,
} from "styletron-react";
import {
	StandardEngine,
} from "styletron-standard";
import {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";

import Configuration from "../configuration/configuration";
import {
	SharedRootState,
} from "../store";
import {
	ChildrenRequiredProps,
} from "../types";
import StateRoot from "./state-root";

type ConfigureContextProperty = (path: string) => JsonValue;

export interface ConfigurationProviderContext {
	configure: ConfigureContextProperty;
}

export interface TranslationProviderContext extends ITranslatorProvider {}

export interface BroadcasterProviderContext {
	broadcaster: IBroadcasterProvider;
}

export interface ProvidersState {
	broadcasterContextValue: BroadcasterProviderContext;
	configurationContextValue: ConfigurationProviderContext;
	systemType: SystemType;
	translateContextValue: TranslationProviderContext;
}

export interface ProvidersProps {
	broadcaster: IBroadcasterProvider;
	configuration: Configuration;
	styletron: StandardEngine;
	translator: ITranslatorProvider;
}

interface StateProps {
	systemType: SystemType;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DispatchProps {}

const mapStateToProps: MapStateToProps<StateProps, ProvidersProps, SharedRootState> = (state: ReadonlyDeep<SharedRootState>) => ({
	// TODO: fix null case.
	systemType: state.shared.metadata.systemType!,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, ProvidersProps> = (_dispatch) => ({});

// NOTE: these default values are not statically available at runtime, since the instances need to be initialized. Instead, they are passed as provider values.
export const ConfigurationContext = React.createContext<ConfigurationProviderContext>(undefined as unknown as ConfigurationProviderContext);
export const TranslateContext = React.createContext<TranslationProviderContext>(undefined as unknown as TranslationProviderContext);
export const BroadcasterContext = React.createContext<BroadcasterProviderContext>(undefined as unknown as BroadcasterProviderContext);

class Providers<P extends ProvidersProps & StateProps & DispatchProps & ChildrenRequiredProps, S extends ProvidersState = ProvidersState> extends React.PureComponent<P, S> {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	override state = {
		broadcasterContextValue: {
			broadcaster: this.props.broadcaster,
		},
		configurationContextValue: {
			configure: Providers.getConfigure(this.props.configuration, this.props.systemType),
		},
		systemType: this.props.systemType,
		translateContextValue: {
			translateSync: (key: string, extras?: Readonly<string[]>) =>
				// eslint-disable-next-line no-sync
				this.props.translator.translateSync(key, extras),
		},
	} as S;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	static getConfigure(configuration: Readonly<Configuration>, systemType: SystemType): ConfigureContextProperty {
		// eslint-disable-next-line no-sync
		return (path: string) => configuration.getSync(systemType, path);
	}

	static getDerivedStateFromProps(props: ReadonlyDeep<ProvidersProps & StateProps>, state: ReadonlyDeep<ProvidersState>) {
		if (props.systemType !== state.systemType) {
			return {
				...state,
				configurationContextValue: {
					// NOTE: dynamically changing this value in render() would re-render all components which depend on the configure context.
					configure: Providers.getConfigure(props.configuration, props.systemType),
				},
			};
		}

		return null;
	}

	override render(): React.ReactNode {
		const {
			styletron,
		} = this.props;

		const {
			configurationContextValue,
			translateContextValue,
			broadcasterContextValue,
		} = this.state;

		return (
			<ConfigurationContext.Provider value={configurationContextValue}>
				<TranslateContext.Provider value={translateContextValue}>
					<BroadcasterContext.Provider value={broadcasterContextValue}>
						<Provider value={styletron}>
							<StateRoot>
								{React.Children.only(this.props.children)}
							</StateRoot>
						</Provider>
					</BroadcasterContext.Provider>
				</TranslateContext.Provider>
			</ConfigurationContext.Provider>
		);
	}
}

export default connect<StateProps, DispatchProps, ProvidersProps, SharedRootState>(mapStateToProps, mapDispatchToProps)(
	Providers,
);
