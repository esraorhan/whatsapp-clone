// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//import firebase from "firebase";
// Firebase v9 modüler import
// Firebase modüllerini içe aktarıyoruz.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup,GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
   
  };

// Firebase uygulamasını başlatıyoruz
const firebaseApp = initializeApp(firebaseConfig);

// Firestore ve Authentication referansları
const db = getFirestore(firebaseApp); // Firestore için yeni kullanım
const auth = getAuth(firebaseApp); // Auth için yeni kullanım
const provider = new GoogleAuthProvider(); // GoogleAuthProvider için yeni kullanım

// Modülleri dışa aktarıyoruz
export { auth, provider,signInWithPopup };
export default db;
  