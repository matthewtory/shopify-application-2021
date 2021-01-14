import { AppAction, AppState } from '../index';
import { Action } from 'redux';
import { Epic, ofType } from 'redux-observable';
import { ListingActionFetchListing, receiveListing } from './actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import listingsRepository from '../../repository';
import { of } from 'rxjs';

const fetchListingEpic: Epic<Action, Action, AppState> = (action$, state$) => action$.pipe(
    ofType<AppAction, ListingActionFetchListing>('fetchListing'),
    switchMap((action) => listingsRepository.getListing(action.listingId).pipe(
        map((listing) => receiveListing(listing)),
        catchError(e => of(receiveListing(undefined, e.message)))
    ))
);

const listingEpics = [
    fetchListingEpic
];

export default listingEpics;