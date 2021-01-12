import {combineReducers, createStore} from "redux";
import auth from "./auth";

export type AppState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    auth
})

const store = createStore(rootReducer);

export default store;