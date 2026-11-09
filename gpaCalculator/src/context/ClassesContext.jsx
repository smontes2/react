import { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { COLLECTIONS } from "../constants/collections";

const ClassContext = createContext();

export function ClassProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userClassesRef = doc(db, COLLECTIONS.USERS, user.uid);
          const docSnap = await getDoc(userClassesRef);

          if (docSnap.exists()) {
            setClasses(docSnap.data().classes || []);
          } else {
            // Initialize user document if it doesn't exist
            await setDoc(userClassesRef, { classes: [] });
            setClasses([]);
          }
        } catch (error) {
          console.error("Error fetching classes:", error);
        }
      } else {
        setClasses([]); // Clear classes when user logs out
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array since we're using onAuthStateChanged

  const addClass = async (
    courseName,
    calculatedGrade,
    letterGrade,
    currentRows,
  ) => {
    const user = auth.currentUser;
    if (!user) return;

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
      setClasses(updatedClasses);
    } catch (error) {
      console.error("Error saving class:", error);
      throw error;
    }
  };

  const removeClass = async (index) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const updatedClasses = classes.filter((_, i) => i !== index);
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userRef, { classes: updatedClasses }, { merge: true });
      setClasses(updatedClasses);
    } catch (error) {
      console.error("Error removing class:", error);
      throw error;
    }
  };

  return (
    <ClassContext.Provider value={{ classes, addClass, removeClass, loading }}>
      {children}
    </ClassContext.Provider>
  );
}

export const useClasses = () => useContext(ClassContext);
