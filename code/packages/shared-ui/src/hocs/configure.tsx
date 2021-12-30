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

import React from "react";
import type {
	Except,
} from "type-fest";

import {
	ConfigurationContext,
} from "../containers/providers.js";

export type ConfigureProp = <T = unknown>(path: string) => T;

export interface ConfigureProps {
	configure: ConfigureProp;
}

export default function configureAttribute<P extends ConfigureProps = ConfigureProps, U = Except<P, keyof ConfigureProps>>() {
	// eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types
	return function configureHoc(ComponentToWrap: React.ComponentType<P>) {
		class ConfigurationHoc extends React.PureComponent<P> {
			static override contextType = ConfigurationContext;
			declare context: React.ContextType<typeof ConfigurationContext>;

			override render(): React.ReactNode {
				return (
					<ComponentToWrap {...this.props} configure={this.context.configure}/>
				);
			}
		}

		return ConfigurationHoc as unknown as React.ComponentClass<U>;
	};
}
