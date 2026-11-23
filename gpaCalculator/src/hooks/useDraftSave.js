import { useCallback, useEffect, useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/** Keep writes ordered and coalesce edits made during an in-flight write. */
export function useDraftSave(collection, user) {
  const session = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const uid = user?.uid;

  useEffect(() => {
    const current = { active: true, pending: null, latest: null, writing: false };
    session.current = current;
    setStatus("idle");
    setError("");
    current.flush = async () => {
      if (current.writing || !uid) return;
      current.writing = true;
      while (current.pending) {
        const data = current.pending;
        current.pending = null;
        try {
          await setDoc(doc(db, collection, uid), data);
          if (current.active && !current.pending) {
            setStatus("saved");
            setError("");
          }
        } catch {
          if (current.active) {
            setStatus("error");
            setError("Draft could not be saved. Keep this page open and try again.");
          }
        }
      }
      current.writing = false;
    };
    return () => { current.active = false; };
  }, [collection, uid]);

  const save = useCallback((data) => {
    const current = session.current;
    if (!uid || !current) return;
    current.latest = data;
    current.pending = data;
    setStatus("saving");
    setError("");
    void current.flush();
  }, [uid]);

  const retry = useCallback(() => {
    if (session.current?.latest) save(session.current.latest);
  }, [save]);

  useEffect(() => {
    if (status !== "saving" && status !== "error") return;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  return { save, status, error, retry };
}
