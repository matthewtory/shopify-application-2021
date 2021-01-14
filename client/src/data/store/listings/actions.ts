import { PiccaPhotoListing } from '../../types';

export const LISTINGS_ACTION_FETCH_LISTINGS = 'fetchListings';
export const LISTINGS_ACTION_RECEIVE_LISTINGS = 'receiveListings';

export type ListingsActionFetchListings = {
    type: typeof LISTINGS_ACTION_FETCH_LISTINGS,
}

export type ListingsActionReceiveListings = {
    type: typeof LISTINGS_ACTION_RECEIVE_LISTINGS,
    listings?: PiccaPhotoListing[],
    error?: string
}

export type ListingsActionTypes = ListingsActionFetchListings
    | ListingsActionReceiveListings

export const fetchListings = (): ListingsActionFetchListings => ({
    type: LISTINGS_ACTION_FETCH_LISTINGS
});

export const receiveListings = (listings?: PiccaPhotoListing[], error?: string): ListingsActionReceiveListings => ({
    type: LISTINGS_ACTION_RECEIVE_LISTINGS,
    listings,
    error
});