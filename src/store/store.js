import { createStore, combineReducers } from "redux";

import datosReducer from "./datosSlice";

const rootReducer = combineReducers({
  datos: datosReducer,
});

export const store = createStore(rootReducer);
