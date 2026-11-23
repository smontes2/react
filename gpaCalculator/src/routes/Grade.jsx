import { useState, useEffect } from "react";
import { PageHeading, RelatedTool, DraftStatus, Loading, ErrorMessage } from "../components/ui/Ui";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Gradebox } from "../components/Gradebox";
import { useClasses } from "../context/ClassesContext";
import { useDraftSave } from "../hooks/useDraftSave";
import { useAuth } from "../context/AuthContext";
import { COLLECTIONS } from "../constants/collections";

const emptyRow = () => ({ assignment: "", grade: "", weight: "" });

const getLetterGrade = (grade) => {
  if (grade >= 93) return "A";
  if (grade >= 90) return "A-";
  if (grade >= 87) return "B+";
  if (grade >= 83) return "B";
  if (grade >= 80) return "B-";
  if (grade >= 77) return "C+";
  if (grade >= 73) return "C";
  if (grade >= 70) return "C-";
  if (grade >= 67) return "D+";
  if (grade >= 63) return "D";
  if (grade >= 60) return "D-";
  return "F";
};

function Grade() {
  const [rows, setRows] = useState([
    emptyRow(),
    emptyRow(),
    emptyRow(),
    emptyRow(),
  ]);
  const [className, setClassName] = useState("");
  const { user, loading } = useAuth();
  const { addClass: addClassToContext } = useClasses();

  const draft = useDraftSave(COLLECTIONS.GRADES, user);
  const [dataLoading, setDataLoading] = useState(Boolean(user) || loading);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const saveData = (currentRows, currentClass) => draft.save({ rows: currentRows, class: currentClass });

  const addRow = () => {
    const updated = [...rows, emptyRow()];
    setRows(updated);
    saveData(updated, className);
  };

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    saveData(updated, className);
  };

  const updateRow = (index, field, value) => {
    const updated = rows.map((r, i) =>
      i === index ? { ...r, [field]: value } : r,
    );
    setRows(updated);
    saveData(updated, className);
  };

  const updateClassName = (value) => {
    setClassName(value);
    saveData(rows, value);
  };

  const restoreClasses = (index, classes) => {
    const selected = classes[index];
    if (!selected) return;
    setRows(selected.row);
    setClassName(selected.courseName);
    saveData(selected.row, selected.courseName);
  };

  const calculateGrade = () => {
    let totalWeight = 0;
    let weightedSum = 0;
    for (const row of rows) {
      const w = parseFloat(row.weight);
      const g = parseFloat(row.grade);
      if (!isNaN(w) && w > 0 && !isNaN(g)) {
        totalWeight += w;
        weightedSum += g * w;
      }
    }
    return totalWeight > 0 ? weightedSum / totalWeight : NaN;
  };

  const addClass = (courseName, currentRows) => {
    const calculatedGrade = calculateGrade();
    const letter = getLetterGrade(calculatedGrade);
    return addClassToContext(courseName, calculatedGrade, letter, currentRows);
  };

  const resetData = () => {
    const empty = [emptyRow(), emptyRow(), emptyRow(), emptyRow()];
    setClassName("");
    setRows(empty);
    saveData(empty, "");
  };

  useEffect(() => {
    if (loading) return;
    if (!user) { setDataLoading(false); return; }
    let active = true;
    setDataLoading(true);
    setLoadError("");
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.GRADES, user.uid));
        if (active) {
          const data = snap.exists() ? snap.data() : {};
          if (data.rows?.length) setRows(data.rows);
          setClassName(data.class || "");
        }
      } catch {
        if (active) setLoadError("Your saved draft could not be loaded. Try again before editing to protect your saved work.");
      } finally {
        if (active) setDataLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user, loading, loadAttempt]);

  return (
    <div className="page-shell">
      <PageHeading
        title="Grade calculator"
        description="Calculate a course grade from your assignments and weights."
        note={!user ? "No account needed" : undefined}
      />
      {loading || dataLoading ? <Loading label="Loading your draft…" /> : loadError ? <>
        <ErrorMessage>{loadError}</ErrorMessage>
        <button
          className="button button-secondary"
          onClick={() => setLoadAttempt((n) => n + 1)}
        >
          Try again
        </button>
      </> : <>
        <DraftStatus
          user={user}
          status={draft.status}
          error={draft.error}
          retry={draft.retry}
        />
        <Gradebox
          addRow={addRow}
          removeRow={removeRow}
          rows={rows}
          updateRow={updateRow}
          calculateGrade={calculateGrade}
          resetData={resetData}
          updateClassName={updateClassName}
          className={className}
          addClass={addClass}
          restoreClasses={restoreClasses}
        />
      </>}
      <RelatedTool
        to="/gpa"
        title="Calculate your semester GPA"
        description="Combine course grades and credit hours."
        label="Open GPA calculator"
      />
    </div>
  );
}

export default Grade;
