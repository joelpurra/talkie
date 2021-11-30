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

import {
	configureStore,
} from "@reduxjs/toolkit";
import IApi from "@talkie/split-environment-interfaces/iapi";
import process from "node:process";
import {
	Action,
	PreloadedState,
	Reducer,
	Store,
} from "redux";
import logger from "redux-logger";
import {
	ReadonlyDeep,
} from "type-fest";

const getStore = <S, A extends Action>(
	initialState: PreloadedState<S> | undefined,
	rootReducer: Reducer<S, A>,
	api: ReadonlyDeep<IApi>,
): Store<S, A> => {
	// HACK: assumes that the initial state is empty during server-side rendering.
	// TODO: promote to function argument?
	const isServerSideRendering = typeof initialState === "undefined";

	const store = configureStore({
		devTools: process.env.TALKIE_ENV === "development",
		middleware: (getDefaultMiddleware) => {
			const defaultMiddlewareOptions = {
				thunk: {
					extraArgument: api,
				},
			};
			const extraMiddlewares = [];

			if (!isServerSideRendering && process.env.TALKIE_ENV === "development") {
				// NOTE: hide logging during server side rendering, since all the output from languages times all applications/pages is too much.
				// NOTE: temporarily enable to debug server-side rendering actions/states.
				extraMiddlewares.push(logger);
			}

			return getDefaultMiddleware(defaultMiddlewareOptions).concat(extraMiddlewares);
		},
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
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUnusableStoreForGeneratedTypes = <S, A extends Action>(rootReducer: Reducer<S, A>): Store<S, A> => getStore(undefined, rootReducer, null as any);

export default getStore;
