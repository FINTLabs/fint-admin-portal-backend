import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import {createLogger} from "redux-logger";
import component from "../reducers/component";
import organisation from "../reducers/organisation";
import contact from "../reducers/contact";

const logger = createLogger();
const store = createStore(
    combineReducers({
        component,
        organisation,
        contact,
    }),
    applyMiddleware(thunkMiddleware, logger)
);

export default store;