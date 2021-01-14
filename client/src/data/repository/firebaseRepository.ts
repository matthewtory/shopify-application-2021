import firebase from 'firebase';
import { PiccaPhotoListing, PiccaPhotoPurchase, StagedPiccaPhotoListing } from '../types';
import { firebaseApp } from '../index';
import { v1 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { PiccaRepository } from './index';

const resolveListingFromData = async (doc: firebase.firestore.DocumentSnapshot): Promise<PiccaPhotoListing | null> => {
    const photo = doc.data() as PiccaPhotoListing;
    if (!photo.thumbRef || !photo.fullRef) return null;

    try {
        const thumbRef = firebaseApp.storage().ref(photo.thumbRef);
        const fullRef = firebaseApp.storage().ref(photo.fullRef);

        const [thumbUrl, fullUrl] = await Promise.all([
            thumbRef.getDownloadURL(),
            fullRef.getDownloadURL()
        ]);

        return {
            ...photo,
            thumbUrl,
            fullUrl,
            id: doc.id
        };
    } catch (e) {
        return null;
    }

};

const resolveListingsFromQuery = async (snapshot: firebase.firestore.QuerySnapshot): Promise<PiccaPhotoListing[]> => {
    return (
        await Promise.all(snapshot.docs.map(resolveListingFromData))
    ).filter(l => !!l)
        .map(l => l as PiccaPhotoListing);
};

const firebaseListingsRepository: PiccaRepository = {
    createListing: async (listing) => {
        const uid = firebaseApp.auth().currentUser?.uid;
        if (!uid) {
            throw new Error('You must be signed in to create a listing');
        }

        const fileId = `${uuid()}_${listing.imageFile.name}`;

        const storageRef = firebaseApp.storage().ref().child(`temp/${fileId}`);
        try {
            await storageRef.put(listing.imageFile);
        } catch (e) {
            throw new Error('Error uploading image ' + e);
        }

        const toAdd: StagedPiccaPhotoListing = {
            uid: uid,
            title: listing.title,
            author: listing.author,
            price: listing.price,
            type: listing.type,
            runSize: listing.runSize ?? null,
            fullRef: storageRef.fullPath,
            description: listing.description,
            dateCreated: firebase.firestore.Timestamp.now(),
            status: null
        };

        const ref = await firebaseApp.firestore().collection('listings_staged').add(toAdd);

        await new Promise((res) => {
            const unsubscribe = ref.onSnapshot((snapshot) => {
                const data = snapshot.data() as StagedPiccaPhotoListing;

                if (data.status === 'complete') {
                    unsubscribe();
                    res(0);
                }
            });
        });

        await firebaseApp.firestore().collection('listings').doc(ref.id).get();

        return ref.id;
    },
    getOwnListings: (uid: string) => {
        return new Observable<PiccaPhotoListing[]>(subscriber => {
            const unsubscribe = firebaseApp.firestore()
                .collection('listings')
                .where('uid', '==', uid)
                .orderBy('dateCreated', 'desc')
                .onSnapshot(async (snapshot) => {
                    const listings = await resolveListingsFromQuery(snapshot);

                    subscriber.next(listings);
                }, (error) => {
                    subscriber.error(error);
                    subscriber.complete();
                });
            return () => unsubscribe();
        });
    },
    getListing: (listingId: string) => new Observable<PiccaPhotoListing>(subscriber => {
        const unsubscribe = firebaseApp.firestore()
            .collection('listings')
            .doc(listingId)
            .onSnapshot(async (snapshot) => {
                if (snapshot.exists) {
                    const resolved = await resolveListingFromData(snapshot);
                    if (resolved) {
                        subscriber.next(resolved);
                        return;
                    }
                }

                subscriber.error(new Error('Listing does not exist'));
            }, (error) => {
                subscriber.error(error);
                subscriber.complete();
            });
        return () => unsubscribe();
    }),
    deleteListing: async (listingId: string) => {
        const ref = firebase.firestore().collection('listings').doc(listingId);

        await ref.delete();
    },
    browseListings: (filter) => new Observable<PiccaPhotoListing[]>(subscriber => {
        let query: firebase.firestore.DocumentSnapshot | firebase.firestore.Query = firebaseApp.firestore()
            .collection('listings');


        if (filter.mode !== undefined && filter.mode !== 'all') {
            query = query.where('type', '==', filter.mode);
        }
        if (filter.priceMin !== undefined) {
            query = query.where('price', '>=', filter.priceMin);
        }
        if (filter.priceMax !== undefined) {
            query = query.where('price', '<=', filter.priceMax);
        }

        query = query.orderBy('dateCreated', 'desc');

        const unsubscribe = query.onSnapshot(async (snapshot) => {
                const listings = await resolveListingsFromQuery(snapshot);
                subscriber.next(listings);
            }, (error) => {
                subscriber.error(error);
                subscriber.complete();
            },
        );

        return () => unsubscribe();
    }),
    getFeaturedListings: async () => {
        const snapshot = await firebaseApp.firestore()
            .collection('listings')
            .orderBy('dateCreated', 'desc')
            .limit(3)
            .get();

        return resolveListingsFromQuery(snapshot);
    },
    purchaseListing: async (listingId: string) => {
        try {
            await firebaseApp.functions().httpsCallable('purchaseListing')({ listingId });
        } catch (e) {
            throw new Error('Failed to make purchase');
        }
    },
    getPurchases: async (uid: string) => {
        const snapshot = await firebaseApp.firestore()
            .collection('purchases')
            .where('uid', '==', uid)
            .orderBy('datePurchased', 'desc')
            .get();

        return (await resolveListingsFromQuery(snapshot)) as PiccaPhotoPurchase[];
    }
};

export default firebaseListingsRepository;