/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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
    applyMiddleware,
    createStore,
    compose,
} from "redux";

import thunk from "redux-thunk";

import {
     persistStore,
     autoRehydrate,
} from "redux-persist";

import crosstabSync from "redux-persist-crosstab";

import rootReducer from "../reducers";

import {
    getPersistKeyPrefix,
    SHARED_STATE_STORAGE_KEY_WHITELIST,
} from "../utils/storage";

import * as api from "../utils/api";

export default function(initialState) {
    const middlewares = applyMiddleware(thunk.withExtraArgument(api));

    const enhancer = compose(
      middlewares,
      autoRehydrate()
    );

    const store = createStore(rootReducer, initialState, enhancer);

    // store.subscribe(() => {
    //     const state = store.getState();
    //
    //     console.log("subscribe", state);
    // });

    const whitelist = SHARED_STATE_STORAGE_KEY_WHITELIST;
    const keyPrefix = getPersistKeyPrefix();

    const persistorOptions = {
        whitelist: whitelist,
        keyPrefix: keyPrefix,
        debounce: 250,
    };

    // const rehydrateCallback = (err, state) => {
    //     console.log("rehydrateCallback", err, state);
    // };

    const persistor = persistStore(store, persistorOptions /*, rehydrateCallback*/);

    const crosstabSyncOptions = {
        whitelist: whitelist,
        keyPrefix: keyPrefix,
    };

    crosstabSync(persistor, crosstabSyncOptions);

    return store;
}
