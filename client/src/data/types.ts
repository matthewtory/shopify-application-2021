import firebase from 'firebase/app';

export type PiccaPhotoListing = {
    uid: string,
    id: string,
    author: string,
    title: string,
    type: 'limited' | 'unlimited',
    runSize?: number | null,
    runStock?: number | null,
    price: number,
    fullRef?: string | null,
    thumbRef?: string | null,
    fullUrl?: string,
    thumbUrl?: string,
    dateCreated: firebase.firestore.Timestamp,
    description?: string | null
}

export type PiccaPhotoPurchase = PiccaPhotoListing & {
    runNumber: number | null,
    datePurchased: firebase.firestore.Timestamp,
    listingId: string
}

export type StagedPiccaPhotoListing = Omit<PiccaPhotoListing, 'imageUrl' | 'id'> & { status: 'complete' | null }
export type NewPiccaPhotoListing = Omit<PiccaPhotoListing, 'id' | 'ref' | 'uid' | 'dateCreated'> & { imageFile: File }