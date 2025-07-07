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
	PreloadedState,
	Reducer,
	Store,
} from "@reduxjs/toolkit";
import toolkit from "@reduxjs/toolkit";
import {
	isTalkieDevelopmentMode,
} from "@talkie/shared-application-helpers/talkie-build-mode.mjs";
import type IApi from "@talkie/split-environment-interfaces/iapi/iapi.mjs";
import logger from "redux-logger";
import type {
	ReadonlyDeep,
} from "type-fest";

const {
	// eslint-disable-next-line import-x/no-named-as-default-member
	configureStore,
} = toolkit;

const getStore = <S, A extends Action>(
	initialState: PreloadedState<S> | undefined,
	rootReducer: Reducer<S, A>,
	api: ReadonlyDeep<IApi>,
): Store<S, A> => {
	// HACK: assumes that the initial state is empty during server-side rendering.
	// TODO: promote to function argument?
	const isServerSideRendering = initialState === undefined;

	const store = configureStore({
		devTools: isTalkieDevelopmentMode(),
		middleware(getDefaultMiddleware) {
			const defaultMiddlewareOptions = {
				thunk: {
					extraArgument: api,
				},
			};
			const extraMiddlewares = [];

			if (!isServerSideRendering && isTalkieDevelopmentMode()) {
				// NOTE: hide logging during server side rendering, since all the output from languages times all applications/pages is too much.
				// NOTE: temporarily enable to debug server-side rendering actions/states.
				extraMiddlewares.push(logger);
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return [
				...getDefaultMiddleware(defaultMiddlewareOptions),
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
				...(extraMiddlewares as any[]),
			];
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
		preloadedState: initialState as any,
		reducer: rootReducer,
	});

	return store;
};

/**
 * Create an unusable store, but which generates the correct types for the given reducer.
 *
 * @param rootReducer A reducer for an application.
 * @returns A store which is to be used only to deduce types.
 * @deprecated The store is unusable, except for typing; fix types instead.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
export const getUnusableStoreForGeneratedTypes = <S, A extends Action>(rootReducer: Reducer<S, A>): Store<S, A> => getStore(undefined, rootReducer, null as any);

export default getStore;
