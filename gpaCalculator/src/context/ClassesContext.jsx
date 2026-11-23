/* eslint-disable react/prop-types -- Context providers accept React children. */
/* eslint-disable react-refresh/only-export-components -- Provider and its hook form the existing context API. */
import { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { COLLECTIONS } from "../constants/collections";

const ClassContext = createContext();

export function ClassProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const request = ++generation;
      const isCurrent = () => active && request === generation;
      setLoading(true);
      setLoadError("");
      setClasses([]);
      try {
        if (user) {
          const userClassesRef = doc(db, COLLECTIONS.USERS, user.uid);
          const docSnap = await getDoc(userClassesRef);
          if (!isCurrent()) return;
          if (docSnap.exists()) {
            setClasses(docSnap.data().classes || []);
          } else {
            await setDoc(userClassesRef, { classes: [] });
          }
        }
      } catch {
        if (isCurrent()) setLoadError("Your saved classes could not be loaded. Check your connection and try again.");
      } finally {
        if (isCurrent()) setLoading(false);
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [loadAttempt]);

  const addClass = async (
    courseName,
    calculatedGrade,
    letterGrade,
    currentRows,
  ) => {
    const user = auth.currentUser;
    if (!user || loading || loadError) throw new Error("Saved classes are not available yet.");

    try {
      const rowsCopy = JSON.parse(JSON.stringify(currentRows));
      const existingClassIndex = classes.findIndex(
        (c) => c.courseName === courseName,
      );

      let updatedClasses;
      if (existingClassIndex !== -1) {
        updatedClasses = classes.map((c, index) =>
          index === existingClassIndex
            ? {
                courseName: courseName,
                row: rowsCopy,
                grade: calculatedGrade,
                letterGrade: letterGrade,
              }
            : c,
        );
      } else {
        updatedClasses = [
          ...classes,
          {
            courseName: courseName,
            row: rowsCopy,
            grade: calculatedGrade,
            letterGrade: letterGrade,
          },
        ];
      }

      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userRef, { classes: updatedClasses }, { merge: true });
      if (auth.currentUser?.uid === user.uid) setClasses(updatedClasses);
    } catch (error) {
      console.error("Error saving class:", error);
      throw error;
    }
  };

  const removeClass = async (index) => {
    const user = auth.currentUser;
    if (!user || loading || loadError) throw new Error("Saved classes are not available yet.");

    try {
      const updatedClasses = classes.filter((_, i) => i !== index);
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userRef, { classes: updatedClasses }, { merge: true });
      if (auth.currentUser?.uid === user.uid) setClasses(updatedClasses);
    } catch (error) {
      console.error("Error removing class:", error);
      throw error;
    }
  };

  return (
    <ClassContext.Provider value={{ classes, addClass, removeClass, loading, loadError, retry: () => setLoadAttempt((n) => n + 1) }}>
      {children}
    </ClassContext.Provider>
  );
}

export const useClasses = () => useContext(ClassContext);
