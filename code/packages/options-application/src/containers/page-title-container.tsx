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

import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import React from "react";

import {
	getPageTitle,
	setPageTitle,
} from "../components/navigation/nav-helpers.mjs";

export interface PageTitleContainerStateProps {
	activeNavigationTabTitle: string | null;
	isPremiumEdition: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageTitleContainerDispatchProps {}

export interface PageTitleContainerProps extends PageTitleContainerStateProps, PageTitleContainerDispatchProps, TranslateProps {}

interface PageTitleContainerState {
	originalPageTitle: string | null;
}

class PageTitleContainer<P extends PageTitleContainerProps> extends React.PureComponent<P, PageTitleContainerState> {
	override state = {
		originalPageTitle: null,
	};

	private get fallbackPageTitle(): string {
		const {
			isPremiumEdition,
			translateSync,
		} = this.props as P;

		// TODO: better fallback?
		// TODO: move resolving the name to the state, like edition type?
		const text = isPremiumEdition
			? translateSync("extensionShortName_Premium")
			: translateSync("extensionShortName_Free");

		return text;
	}

	constructor(props: P) {
		super(props);

		this.setPageTitlePrerenderingSafe = this.setPageTitlePrerenderingSafe.bind(this);
		this.setPartialPageTitle = this.setPartialPageTitle.bind(this);
		this.storeOriginalPageTitle = this.storeOriginalPageTitle.bind(this);
		this.restoreOriginalPageTitle = this.restoreOriginalPageTitle.bind(this);
	}

	override componentDidMount(): void {
		this.storeOriginalPageTitle();
	}

	override componentWillUnmount(): void {
		this.restoreOriginalPageTitle();
	}

	setPageTitlePrerenderingSafe(pageTitle: string): void {
		// HACK: disable setting the title during server-side pre-rendering.
		// TODO: break out document-dependent code and inject browser-/server-specific dependencies.
		if (typeof document === "object") {
			// TODO: use reactjs builtin page-level <title> handling.
			// https://react.dev/reference/react-dom/components/title
			setPageTitle(pageTitle);
		}
	}

	storeOriginalPageTitle(): void {
		const originalPageTitle = getPageTitle();

		this.setState(
			{
				originalPageTitle,
			},
		);
	}

	restoreOriginalPageTitle(): void {
		const {
			originalPageTitle,
		} = this.state;

		const pageTitleString = originalPageTitle ?? this.fallbackPageTitle;

		// NOTE: not resetting the originalPageTitle state to null; possible mount/unmount originalPageTitle/activeNavigationTabTitle state/props race conditions?
		this.setPageTitlePrerenderingSafe(pageTitleString);
	}

	setPartialPageTitle(partialPageTitle: string | null): void {
		// NOTE: attempting to match the format of hardcoded <title> tags.
		const mdash = "—";
		const separator = ` ${mdash} `;

		// NOTE: gracefully handling the case where the partial page title is empty/null/undefined.
		const pageTitle = partialPageTitle
			? [
				partialPageTitle,
				separator,
				this.state.originalPageTitle,
			].join("")
			: this.state.originalPageTitle ?? this.fallbackPageTitle;

		this.setPageTitlePrerenderingSafe(pageTitle);
	}

	override render(): React.ReactNode {
		// NOTE: not "rendering" the outside-of-root title html element, but using render() as it should be a good place to actually perform html element updates.
		this.setPartialPageTitle(this.props.activeNavigationTabTitle);

		return null;
	}
}

export default translateAttribute<PageTitleContainerProps>()(
	PageTitleContainer,
);
