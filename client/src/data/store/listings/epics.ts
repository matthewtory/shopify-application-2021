import { AppAction, AppState } from '../index';
import { Epic, ofType } from 'redux-observable';
import { Action } from 'redux';
import { ListingsActionFetchListings, receiveListings } from './actions';
import { map, switchMap, catchError, withLatestFrom, delay } from 'rxjs/operators';
import listingsRepository from 'data/repository';
import { of } from 'rxjs';

const fetchListingsEpic: Epic<Action, Action, AppState> = (action$, state$) => action$.pipe(
    ofType<AppAction, ListingsActionFetchListings>('fetchListings'),
    withLatestFrom(state$),
    switchMap(([_, state]) => {
        if (state.auth.user) {
            return listingsRepository.getOwnListings(state.auth.user.uid).pipe(
                map((listings) => receiveListings(listings)),
                catchError((e) => {
                    console.log(e);
                    return of(receiveListings(undefined, e.message));
                })
            );
        }

        throw new Error('You must be signed in to fetch your own listings.');
    })
);

const listingsEpics = [
    fetchListingsEpic
];

export default listingsEpics;
