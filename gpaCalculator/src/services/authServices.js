import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export const signUp = async (email, password) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const login = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logout = () => signOut(auth);
