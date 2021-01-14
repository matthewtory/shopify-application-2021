import { NewPiccaPhotoListing, PiccaPhotoListing, PiccaPhotoPurchase } from '../types';
import { Observable } from 'rxjs';
import firebaseRepository from './firebaseRepository';

export interface PiccaRepository {
    createListing: (listing: NewPiccaPhotoListing) => Promise<string>,
    getOwnListings: (uid: string) => Observable<PiccaPhotoListing[]>,
    getListing: (listingId: string) => Observable<PiccaPhotoListing>,
    deleteListing: (listingId: string) => Promise<void>,
    browseListings: (filter: BrowseListingsFilter) => Observable<PiccaPhotoListing[]>,
    purchaseListing: (listingId: string) => Promise<void>,
    getFeaturedListings: () => Promise<PiccaPhotoListing[]>,
    getPurchases: (uid: string) => Promise<PiccaPhotoPurchase[]>
}

export type BrowseListingsFilter = {
    priceMin?: number,
    priceMax?: number,
    mode?: 'all' | 'limited' | 'unlimited'
}

const piccaRepository = firebaseRepository;

export default piccaRepository;

