import { PiccaPhotoListing } from '../../types';

export const LISTING_ACTION_FETCH_LISTING = 'fetchListing';
export const LISTING_ACTION_RECEIVE_LISTING = 'receiveListing';

export type ListingActionFetchListing = {
    type: typeof LISTING_ACTION_FETCH_LISTING,
    listingId: string
}

export type ListingActionReceiveListing = {
    type: typeof LISTING_ACTION_RECEIVE_LISTING,
    listing?: PiccaPhotoListing,
    error?: string
}

export type ListingActionTypes = ListingActionFetchListing
    | ListingActionReceiveListing

export const fetchListing = (listingId: string): ListingActionFetchListing => ({
    type: LISTING_ACTION_FETCH_LISTING,
    listingId
});

export const receiveListing = (listing?: PiccaPhotoListing, error?: string): ListingActionReceiveListing => ({
    type: LISTING_ACTION_RECEIVE_LISTING,
    listing,
    error
});