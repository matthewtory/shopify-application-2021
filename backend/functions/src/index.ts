import * as functions from 'firebase-functions';
import * as path from 'path';
import * as os from 'os';
import * as gm from 'gm';
import * as fs from 'fs';
import admin, { storage, firestore } from 'firebase-admin';

admin.initializeApp();

const storageBucketName = 'shopify-application-2021.appspot.com';
const storageBucket = storage().bucket(storageBucketName);

export const onListingStaged = functions.firestore
    .document('/listings_staged/{listingId}')
    .onCreate(async (snapshot, context) => {
        const { listingId } = context.params;
        const data = snapshot.data();

        functions.logger.log('staged', data);

        const ref = data['fullRef'];
        if (typeof ref === 'string') {
            const stagedStorageRef = storageBucket.file(ref);

            if (await stagedStorageRef.exists()) {
                const fileName = path.basename(stagedStorageRef.name);

                const tempFile = path.join(os.tmpdir(), fileName);
                const tempFileThumb = path.join(os.tmpdir(), `thumb_${fileName}`);

                await stagedStorageRef.download({ destination: tempFile });

                const m = gm.subClass({
                    imageMagick: true
                });

                try {
                    await Promise.all([
                        new Promise((resolve, reject) => {
                            m(tempFile)
                                .resize(1024, 1024)
                                .fill('rgba(255, 255, 255,0.4)')
                                .gravity('Center')
                                .font('./assets/font.ttf', 140)
                                .drawText(0, 0, 'PICCA')
                                .write(tempFile, (e) => {
                                    if (e) {
                                        reject(e);
                                    } else {
                                        resolve(0);
                                    }
                                });
                        }),
                        new Promise((resolve, reject) => {
                            m(tempFile)
                                .resize(512, 512)
                                .write(tempFileThumb, (e) => {
                                    if (e) {
                                        reject(e);
                                    } else {
                                        resolve(0);
                                    }
                                });
                        })
                    ]);

                    const destination = `listings/${listingId}/${fileName}`;
                    const thumbDestination = `listings/${listingId}/thumb_${fileName}`;

                    await Promise.all([
                        storageBucket.upload(tempFile, {
                            destination
                        }),
                        storageBucket.upload(tempFileThumb, {
                            destination: thumbDestination
                        }),
                        stagedStorageRef.delete()
                    ]);
                    data['fullRef'] = destination;
                    data['thumbRef'] = thumbDestination;
                } catch (e) {
                    functions.logger.log('Error occured writing file');
                } finally {
                    try {
                        fs.unlinkSync(tempFile);
                    } catch (e) {
                        functions.logger.log('Error deleting file', e);
                    }
                }
            }
        }

        const runSize = data['runSize'];
        if (runSize) {
            data['runStock'] = runSize;
        }

        const listingRef = firestore().collection('listings').doc(listingId);
        await Promise.all([
            listingRef.set(data),
            snapshot.ref.update({ status: 'complete' })
        ]);
    });

export const purchaseListing = functions.https.onCall(async (data, context) => {
    const uid = context.auth?.uid;
    if (uid === undefined) {
        functions.logger.log('Cannot purchase. not authenticated');
        return;
    }
    const { listingId } = data;

    if (typeof listingId === 'string') {
        const listingRef = admin.firestore().collection('listings').doc(listingId);

        await admin.firestore().runTransaction(async (transaction) => {
            const doc = await transaction.get(listingRef);
            const data = doc.data();

            if (data) {
                const listingDataToUdpate: Record<string, any> = {};

                const listingType = data['type'] as string;

                let canPurchase = true;
                let runNumber: number | null = null;
                if (listingType === 'limited') {
                    const listingRunSize = data['runSize'] as number;
                    const listingRunStock = data['runStock'] as number;

                    if (listingRunStock <= 0) {
                        canPurchase = false;
                    } else {
                        listingDataToUdpate['runStock'] = listingRunStock - 1;
                        runNumber = listingRunSize - listingRunStock + 1;
                    }
                }

                if (canPurchase) {
                    transaction.set(listingRef, listingDataToUdpate, { merge: true });

                    const purchaseRef = admin.firestore().collection('purchases').doc();

                    transaction.create(purchaseRef, {
                        ...data,
                        uid,
                        datePurchased: admin.firestore.Timestamp.now(),
                        runNumber
                    });
                }
            }
        });
    }
});
