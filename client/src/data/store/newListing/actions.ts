import { NewPiccaPhotoListing, PiccaPhotoListing } from '../../types';

export const NEW_LISTING_ACTION_CREATE_LISTING = 'createListing';
export const NEW_LISTING_ACTION_CREATE_LISTING_SUCCESS = 'createListingSuccess';
export const NEW_LISTING_ACTION_CREATE_LISTING_ERROR = 'createListingError';
export const NEW_LISTING_ACTION_CLEAR_LISTING = 'clearListing';

export type NewListingActionCreateListing = {
    type: typeof NEW_LISTING_ACTION_CREATE_LISTING,
    listing: NewPiccaPhotoListing
}

export type NewListingActionCreateListingSuccess = {
    type: typeof NEW_LISTING_ACTION_CREATE_LISTING_SUCCESS,
    listingId: string
}

export type NewListingActionCreateListingError = {
    type: typeof NEW_LISTING_ACTION_CREATE_LISTING_ERROR,
    error: string
}

export type NewListingActionClearNewListing = {
    type: typeof NEW_LISTING_ACTION_CLEAR_LISTING,
}

export type NewListingActionTypes = NewListingActionCreateListing
    | NewListingActionCreateListingSuccess
    | NewListingActionCreateListingError
    | NewListingActionClearNewListing

export const createListing = (listing: NewPiccaPhotoListing): NewListingActionCreateListing => ({
    type: NEW_LISTING_ACTION_CREATE_LISTING,
    listing
});

export const createListingSuccess = (listingId: string): NewListingActionCreateListingSuccess => ({
    type: NEW_LISTING_ACTION_CREATE_LISTING_SUCCESS,
    listingId
});

export const createListingError = (error: string): NewListingActionCreateListingError => ({
    type: NEW_LISTING_ACTION_CREATE_LISTING_ERROR,
    error
});

export const clearNewListing = (): NewListingActionClearNewListing => ({
    type: NEW_LISTING_ACTION_CLEAR_LISTING
});