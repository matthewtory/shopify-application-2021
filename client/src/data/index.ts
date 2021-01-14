import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

export const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyBCxY8Y71pIqewoMWHnyB4P-A1sXC85RrI',
    authDomain: 'shopify-application-2021.firebaseapp.com',
    projectId: 'shopify-application-2021',
    storageBucket: 'shopify-application-2021.appspot.com',
    messagingSenderId: '6110033653',
    appId: '1:6110033653:web:2e2193bd976617c81177bc',
    measurementId: 'G-K5PYK54RMW'
});

firebaseApp.analytics();