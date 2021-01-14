import { PiccaPhotoListing } from '../../types';
import { BrowseListingsFilter } from '../../repository';

export const BROWSE_ACTION_BROWSE_LISTINGS = 'browseListings';
export const BROWSE_ACTION_RECEIVE_LISTINGS = 'browseReceiveListings';

export type BrowseActionBrowseListings = {
    type: typeof BROWSE_ACTION_BROWSE_LISTINGS,
    filter: BrowseListingsFilter
}

export type BrowseActionReceiveListings = {
    type: typeof BROWSE_ACTION_RECEIVE_LISTINGS,
    listings?: PiccaPhotoListing[],
    error?: string
}

export type BrowseActionTypes = BrowseActionBrowseListings | BrowseActionReceiveListings

export const browseListings = (filter: BrowseActionBrowseListings['filter']) => ({
    type: BROWSE_ACTION_BROWSE_LISTINGS,
    filter
});

export const receiveListings = (listings?: PiccaPhotoListing[], error?: string) => ({
    type: BROWSE_ACTION_RECEIVE_LISTINGS,
    listings,
    error
});