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

import type IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";
import React from "react";
import type {
	Except,
} from "type-fest";

import {
	BroadcasterContext,
} from "../containers/providers.js";

export interface BroadcasterProps {
	broadcaster: IBroadcasterProvider;
}

export default function broadcasterAttribute<P extends BroadcasterProps = BroadcasterProps, U = Except<P, keyof BroadcasterProps>>() {
	// eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/prefer-readonly-parameter-types
	return function broadcasterHoc(ComponentToWrap: React.ComponentType<P>) {
		class BroadcasterHoc extends React.PureComponent<P> {
			static override contextType = BroadcasterContext;
			declare context: React.ContextType<typeof BroadcasterContext>;

			override render(): React.ReactNode {
				return (
					<ComponentToWrap {...this.props} broadcaster={this.context.broadcaster}/>
				);
			}
		}

		return BroadcasterHoc as unknown as React.ComponentClass<U>;
	};
}
