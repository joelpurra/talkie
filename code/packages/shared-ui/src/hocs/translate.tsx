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

import type ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import type {
	Except,
} from "type-fest";

import React from "react";

import {
	TranslateContext,
} from "../containers/providers.js";

export interface TranslateProps extends ITranslatorProvider {}

export default function translateAttribute<P extends TranslateProps = TranslateProps, U = Except<P, keyof TranslateProps>>() {
	// eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/prefer-readonly-parameter-types
	return function translateHoc(ComponentToWrap: React.ComponentType<P>) {
		class TranslationHoc extends React.PureComponent<P> {
			static override contextType = TranslateContext;

			// eslint-disable-next-line react/static-property-placement
			declare context: React.ContextType<typeof TranslateContext>;

			override render(): React.ReactNode {
				return (
					<ComponentToWrap
						{...this.props}
						// eslint-disable-next-line no-sync
						translatePlaceholderSync={this.context.translatePlaceholderSync}
						// eslint-disable-next-line no-sync
						translateSync={this.context.translateSync}/>
				);
			}
		}

		return TranslationHoc as unknown as React.ComponentClass<U>;
	};
}
