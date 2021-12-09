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

import IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";
import ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import React from "react";
import {
	Provider as StoreProvider,
} from "react-redux";
import {
	Action,
	Store,
} from "@reduxjs/toolkit";
import {
	StandardEngine,
} from "styletron-standard";

import ErrorBoundary from "../components/error-boundary.js";
import Configuration from "../configuration/configuration.mjs";
import {
	ChildrenRequiredProps,
} from "../types.mjs";
import Providers from "./providers.js";

export interface RootProps<S, A extends Action> {
	broadcaster: IBroadcasterProvider;
	configuration: Configuration;

	// NOTE: store is more strictly typed than ProviderProps<A> from react-redux.
	store: Store<S, A>;
	styletron: StandardEngine;
	translator: ITranslatorProvider;
}

export default class Root<S, A extends Action, P extends RootProps<S, A> & ChildrenRequiredProps> extends React.PureComponent<P, S> {
	override render(): React.ReactNode {
		const {
			broadcaster,
			configuration,
			store,
			styletron,
			translator,
		} = this.props;

		return (
			<React.StrictMode>
				<ErrorBoundary>
					<StoreProvider store={store}>
						<Providers broadcaster={broadcaster} configuration={configuration} styletron={styletron} translator={translator}>
							{React.Children.only(this.props.children)}
						</Providers>
					</StoreProvider>
				</ErrorBoundary>
			</React.StrictMode>
		);
	}
}
