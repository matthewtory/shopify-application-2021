import { PiccaPhotoListing } from '../../types';
import { AppAction } from '../index';
import { BROWSE_ACTION_BROWSE_LISTINGS, BROWSE_ACTION_RECEIVE_LISTINGS } from './actions';
import produce from 'immer';

type BrowseState = {
    listings?: PiccaPhotoListing[],
    error?: string
}

const initialState: BrowseState = {};

const browseReducer = (state = initialState, action: AppAction) => {
    switch (action.type) {
        case BROWSE_ACTION_BROWSE_LISTINGS:
            return produce(state, draft => {
                draft.error = undefined;
            });
        case BROWSE_ACTION_RECEIVE_LISTINGS:
            return produce(state, draft => {
                draft.listings = action.listings;
                draft.error = action.error;
            });
        default:
            return state;
    }
};

export default browseReducer;