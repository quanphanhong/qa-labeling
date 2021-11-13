import { firebaseApp } from "./firebaseApp";
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    getDocs
} from "firebase/firestore";

const db = getFirestore( firebaseApp );

export async function getDocument( referenceToDoc ) {
    const docRef = doc( db, referenceToDoc );
    const docSnap = await getDoc( docRef );

    if ( docSnap.exists ) {
        console.log( "Document data: ", docSnap.data() );
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
        console.log( doc.id, " => ", doc.data() );
        collectionData.push({
            id: doc.id,
            data: doc.data()
        } );
    } );

    return collectionData;
}