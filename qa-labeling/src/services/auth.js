import { firebaseApp } from './firebaseApp';
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

const auth = getAuth( firebaseApp );

export const registerAuthChangedEvent = () => {
    onAuthStateChanged( auth, user => {
        if ( user !== null ) {
            console.log( 'Logged in!' );
        } else {
            console.log(' No user ');
        }
    } );
}

export const signUpWithEmail = ( email, password ) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then( ( userCredential ) => {
            const user = userCredential.user;
            console.log( "Sign up successfully!" );
            console.log( user );
        } )
        .catch( ( error ) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log( 'Sign up error: [%d] %s', errorCode, errorMessage );
        });
}

export const signInWithEmail = ( email, password ) => {
    signInWithEmailAndPassword( auth, email, password )
        .then((userCredential) => {
            const user = userCredential.user;
            console.log( "Login successfully!" );
            console.log( user );
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log( 'Login error: [%d] %s', errorCode, errorMessage );
        });
}

export const logOut = () => {
    signOut( auth )
        .then( () => {
            console.log( "Sign out successful!" );
        } )
        .catch( ( error ) => {
            console.log( "There was an error with logging out!" )
        } );
}