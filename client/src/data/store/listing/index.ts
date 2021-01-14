import { PiccaPhotoListing } from '../../types';
import { AppAction } from '../index';
import { LISTING_ACTION_FETCH_LISTING, LISTING_ACTION_RECEIVE_LISTING } from './actions';
import produce from 'immer';

export type ListingState = {
    listing?: PiccaPhotoListing,
    error?: string
}

const initialState = {};

const listingReducer = (state: ListingState = initialState, action: AppAction): ListingState => {
    switch (action.type) {
        case LISTING_ACTION_FETCH_LISTING:
            return produce(state, draft => {
                draft.listing = undefined;
            });
        case LISTING_ACTION_RECEIVE_LISTING:
            return produce(state, draft => {
                draft.listing = action.listing;
                draft.error = action.error;
            });
        default:
            return state;
    }
};

export default listingReducer;