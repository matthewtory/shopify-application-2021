import { Action } from 'redux';
import { Epic, ofType } from 'redux-observable';
import { BROWSE_ACTION_BROWSE_LISTINGS, BrowseActionBrowseListings } from './actions';
import { AppAction, AppState } from '../index';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { receiveListings } from './actions';
import listingsRepository from '../../repository';
import { of } from 'rxjs';


const browseListingsEpic: Epic<Action, Action, AppState> = (action$, state$) => action$.pipe(
    ofType<AppAction, BrowseActionBrowseListings>(BROWSE_ACTION_BROWSE_LISTINGS),
    switchMap(action => {
        return listingsRepository.browseListings(action.filter).pipe(
            debounceTime(500),
            map(l => receiveListings(l)),
            catchError(e => of(receiveListings(undefined, e.message)))
        );
    })
);

const browseEpics = [
    browseListingsEpic
];

export default browseEpics;