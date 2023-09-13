import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  signInWithPopup,
} from "firebase/auth";
import { app, db, auth } from "./firebase";
import { doc, runTransaction, setDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth/cordova";

/**
 * This method will throw errors defined by the firebase auth package, handle them while calling it
 */
export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential;
}

/**
 * This method will throw errors defined by the firebase auth package, handle them while calling it
 */
export async function signUp(
  username: string,
  email: string,
  password: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // create entry in firebase user table
  setDoc(doc(db, "users", user.uid), {
    username,
    name: user.displayName,
    email: user.email,
    id: user.uid,
    photoUrl: user.photoURL,
  });

  return userCredential;
}

export async function signOut() {
  const auth = getAuth(app);
  await fbSignOut(auth);
}

export async function continueWithGoogle() {
  //    throw new Error("Not implemented");
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      throw new Error("User already in database");
    }

    transaction.set(doc(db, "users", user.uid), {
      username: user.displayName,
      email: user.email,
      id: user.uid,
      photoUrl: user.photoURL,
    });
  });

  return user;
}
