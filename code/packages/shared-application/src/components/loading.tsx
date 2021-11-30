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

import translateAttribute, {
	TranslateProps,
} from "../hocs/translate";
import * as lighter from "../styled/text/lighter";
import {
	ClassNameProp,
} from "../styled/types";
import {
	ChildrenRequiredProps,
} from "../types";

export interface LoadingProps extends ChildrenRequiredProps, ClassNameProp {
	enabled: boolean;
	isBlockElement?: boolean;
}

interface InternalProps extends LoadingProps, TranslateProps {}

class Loading<P extends InternalProps> extends React.PureComponent<P> {
	static defaultProps = {
		isBlockElement: false,
	};

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			children,
			className,
			enabled,
			isBlockElement,
			translateSync,
		} = this.props as InternalProps;

		if (enabled) {
			return children;
		}

		const LoadingWrapper = isBlockElement
			? lighter.p
			: lighter.span;

		return (
			<LoadingWrapper
				className={className}
			>
				{translateSync("frontend_loading")}
			</LoadingWrapper>
		);
	}
}

export default translateAttribute<InternalProps>()(
	Loading,
);
