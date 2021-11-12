import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBpzrvYWFwdkpm2SDnPmXOizMizYQJsDOs",
    authDomain: "question-answering-labeling.firebaseapp.com",
    projectId: "question-answering-labeling",
    storageBucket: "question-answering-labeling.appspot.com",
    messagingSenderId: "913394009100",
    appId: "1:913394009100:web:2f725599ff2f53dbc71a29",
    measurementId: "G-V56PPV1DZ8"
};

export const firebaseApp = initializeApp( firebaseConfig );