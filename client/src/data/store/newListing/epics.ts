import { Epic, ofType } from 'redux-observable';
import { AppAction, AppState } from '../index';
import { Action, AnyAction } from 'redux';
import listingsRepository from 'data/repository';
import {
    clearNewListing, createListingError,
    createListingSuccess, NEW_LISTING_ACTION_CREATE_LISTING_SUCCESS,
    NewListingActionClearNewListing,
    NewListingActionCreateListing, NewListingActionCreateListingSuccess
} from './actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

const createListingEpic: Epic<Action, Action, AppState> = (action$, state$) => action$.pipe(
    ofType<AppAction, NewListingActionCreateListing>('createListing'),
    withLatestFrom(state$),
    switchMap(async ([action, state]) => {
        try {
            const listingId = await listingsRepository.createListing(action.listing);

            return createListingSuccess(listingId);
        } catch (e) {
            return createListingError(e.message);
        }
    })
);

const clearNewListingEpic: Epic<Action, Action, AppState> = (action$) => action$.pipe(
    ofType<AppAction, NewListingActionCreateListingSuccess>(NEW_LISTING_ACTION_CREATE_LISTING_SUCCESS),
    map((_) => clearNewListing())
);

const newListingEpics = [
    createListingEpic,
    clearNewListingEpic
];

export default newListingEpics;