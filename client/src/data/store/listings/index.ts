import { PiccaPhotoListing } from '../../types';
import { AppAction } from '../index';
import { LISTINGS_ACTION_RECEIVE_LISTINGS } from './actions';
import produce from 'immer';

export type ListingsState = {
    listings?: PiccaPhotoListing[],
    error?: string
}

const initialState: ListingsState = {};

const listingsReducer = (state = initialState, action: AppAction) => {
    switch (action.type) {
        case LISTINGS_ACTION_RECEIVE_LISTINGS:
            return produce(state, draft => {
                draft.listings = action.listings;
                draft.error = action.error;
            });
        default:
            return state;
    }
};

export default listingsReducer;