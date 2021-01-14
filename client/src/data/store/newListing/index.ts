import {
    NEW_LISTING_ACTION_CLEAR_LISTING,
    NEW_LISTING_ACTION_CREATE_LISTING,
    NEW_LISTING_ACTION_CREATE_LISTING_ERROR,
    NEW_LISTING_ACTION_CREATE_LISTING_SUCCESS
} from './actions';
import produce from 'immer';
import { AppAction } from '../index';

export type NewListingState = {
    loading: boolean,
    error?: string,
    newListingId?: string
}

const initialState: NewListingState = {
    loading: false
};

const newListingReducer = (state = initialState, action: AppAction) => {
    switch (action.type) {
        case NEW_LISTING_ACTION_CREATE_LISTING:
            return produce(state, draft => {
                draft.loading = true;
                draft.error = undefined;
                draft.newListingId = undefined;
            });
        case NEW_LISTING_ACTION_CREATE_LISTING_SUCCESS:
            return produce(state, draft => {
                draft.loading = false;
                draft.newListingId = action.listingId;
            });
        case NEW_LISTING_ACTION_CREATE_LISTING_ERROR:
            return produce(state, draft => {
                draft.loading = false;
                draft.error = action.error;
            });
        case NEW_LISTING_ACTION_CLEAR_LISTING:
            return produce(state, draft => {
                draft.newListingId = undefined;
                draft.loading = false;
                draft.error = undefined;
            });
        default:
            return state;
    }
};

export default newListingReducer;