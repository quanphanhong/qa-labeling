import { firebaseApp } from "./firebaseApp";
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";


const db = getFirestore( firebaseApp );

export async function getDocument( referenceToDoc ) {
    const docRef = doc( db, referenceToDoc );
    const docSnap = await getDoc( docRef );

    if ( docSnap.exists ) {
        return docSnap.data();
    } else {
        console.log( "No such document" );
    }
}

export async function getAllDocumentInCollection( referenceToCollection ) {
    const collectionRef = collection( db, referenceToCollection );
    const querySnapshot = await getDocs( collectionRef );

    const collectionData = [];

    querySnapshot.forEach( ( doc ) => {
        collectionData.push({
            id: doc.id,
            data: doc.data()
        } );
    } );

    return collectionData;
}

export async function createDocument( referenceToCollection, data ) {
    const collectionRef = collection( db, referenceToCollection );

    const docRef = await addDoc( collectionRef, data );

    return docRef.id;
}

export async function updateDocument( referenceToDoc, updatedData ) {
    const docRef = doc( db, referenceToDoc );

    await updateDoc( docRef, updatedData );
}

export async function deleteDocument( referenceToDoc ) {
    const docRef = doc( db, referenceToDoc );

    await deleteDoc( docRef );
}

export function getServerTimestamp() {
    return serverTimestamp();
}