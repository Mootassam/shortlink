import { combineReducers, configureStore } from "@reduxjs/toolkit";
import shortLinkReducers from "./shortLink/shortLinkReducers";
import { persistReducer, persistStore } from "redux-persist"; // Import persistStore
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  generate: shortLinkReducers,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  // Remove the thunkMiddleware here, Redux Toolkit handles thunks internally
});

const persistor = persistStore(store); // Initialize the persisted store

export { store, persistor }; // Export both the store and the persistor
