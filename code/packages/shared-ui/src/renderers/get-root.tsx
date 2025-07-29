/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type {
	Action,
	Store,
} from "@reduxjs/toolkit";
import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import type IStyletronProvider from "@talkie/split-environment-interfaces/istyletron-provider.mjs";
import type ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";

import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import React from "react";

import Root from "../containers/root.js";

const getRoot = async <S, A extends Action, P>(
	store: Readonly<Store<S, A>>,
	translatorProvider: Readonly<ITranslatorProvider>,
	configuration: Readonly<IConfiguration>,
	styletronProvider: Readonly<IStyletronProvider>,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	messageBusProviderGetter: Readonly<IMessageBusProviderGetter>,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	ChildComponent: React.ComponentType<P>,
	// eslint-disable-next-line max-params
): Promise<React.ReactElement> => {
	// eslint-disable-next-line no-sync
	const styletron = styletronProvider.getInstanceSync();

	// TODO: figure out why this cast is needed.
	// TODO: use React.Children.only()?
	const CastChildComponent = ChildComponent as React.ComponentType<unknown>;
	const root = (
		<Root
			configuration={configuration}
			messageBusProviderGetter={messageBusProviderGetter}
			store={store as unknown as Store<unknown>}
			styletron={styletron}
			translator={translatorProvider}
		>
			<CastChildComponent/>
		</Root>
	);

	return root;
};

export default getRoot;
