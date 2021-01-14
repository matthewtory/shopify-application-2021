import { Action, applyMiddleware, combineReducers, createStore, Reducer } from 'redux';
import auth, { initializeAuth } from './auth';
import newListing from './newListing';
import listings from './listings';
import listing from './listing';
import browse from './browse';
import newListingEpics from './newListing/epics';
import listingEpics from './listing/epics';
import browseEpics from './browse/epics';
import { AuthActionTypes } from './auth/actions';
import { NewListingActionTypes } from './newListing/actions';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { ListingsActionTypes } from './listings/actions';
import listingsEpics from './listings/epics';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ListingActionTypes } from './listing/actions';
import { BrowseActionTypes } from './browse/actions';

export type AppState = ReturnType<typeof rootReducer>
export type AppAction = AuthActionTypes
    | NewListingActionTypes
    | ListingsActionTypes
    | ListingActionTypes
    | BrowseActionTypes

const epicMiddleware = createEpicMiddleware<Action, Action, AppState>();
const rootEpic = combineEpics(...[
    ...newListingEpics,
    ...listingsEpics,
    ...listingEpics,
    ...browseEpics
]);

const rootReducer = combineReducers({
    auth,
    newListing,
    listings,
    listing,
    browse
});

const composeEnhancers = composeWithDevTools({});

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware))
);

initializeAuth(store);

epicMiddleware.run(rootEpic);

export default store;