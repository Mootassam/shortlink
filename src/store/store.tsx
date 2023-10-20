import { combineReducers, configureStore } from "@reduxjs/toolkit";
import shortLInkReducers from "./shortLink/shortLinkReducers";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const presistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  generate: shortLInkReducers,
});
const persistedReducer = persistReducer(presistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  // Remove the thunkMiddleware here, Redux Toolkit handles thunks internally
});

export default store;
