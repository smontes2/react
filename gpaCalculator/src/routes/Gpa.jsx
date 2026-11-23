import { useState, useEffect } from "react";
import { GpaBox } from "../components/GpaBox";
import { useLocation } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDraftSave } from "../hooks/useDraftSave";
import { useAuth } from "../context/AuthContext";
import { COLLECTIONS } from "../constants/collections";
import { PageHeading, DraftStatus, Loading, ErrorMessage } from "../components/ui/Ui";

const GRADE_POINTS = {
  "A+": 4.33,
  A: 4.0,
  "A-": 3.67,
  "B+": 3.33,
  B: 3.0,
  "B-": 2.67,
  "C+": 2.33,
  C: 2.0,
  "C-": 1.67,
  "D+": 1.33,
  D: 1.0,
  "D-": 0.67,
  F: 0.0,
};

const emptyRow = () => ({ course: "", grade: "", credits: "" });

function Gpa() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const [rows, setRows] = useState(() => {
    const initial = location.state?.classes?.map((c) => ({ course: c.courseName || "", grade: c.grade || "", credits: "4" })) || [];
    while (initial.length < 4) initial.push(emptyRow());
    return initial;
  });
  const [calculations, setCalculations] = useState([]);
  const [prior, setPrior] = useState({ priorGpa: "", priorCredits: "" });

  const draft = useDraftSave(COLLECTIONS.GPA, user);
  const saveImportedDraft = draft.save;
  const [dataLoading, setDataLoading] = useState(Boolean(user) || loading);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const saveData = (currentRows, currentPrior, currentCalculations) => draft.save({ rows: currentRows, prior: currentPrior, calculations: currentCalculations });

  const addRow = () => {
    const updated = [...rows, emptyRow()];
    setRows(updated);
    saveData(updated, prior, calculations);
  };

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    saveData(updated, prior, calculations);
  };

  const updateRow = (index, field, value) => {
    const updated = rows.map((r, i) =>
      i === index ? { ...r, [field]: value } : r,
    );
    setRows(updated);
    saveData(updated, prior, calculations);
  };

  const updatePrior = (priorGpa, priorCredits) => {
    const updated = { priorGpa, priorCredits };
    setPrior(updated);
    saveData(rows, updated, calculations);
  };

  const calculateGPA = (includePrior) => {
    let totalPoints = 0;
    let totalCredits = 0;

    if (includePrior && prior.priorGpa && prior.priorCredits) {
      totalPoints = parseFloat(prior.priorCredits) * parseFloat(prior.priorGpa);
      totalCredits = parseFloat(prior.priorCredits);
    }

    for (const row of rows) {
      const points = GRADE_POINTS[row.grade];
      const credits = parseFloat(row.credits);
      if (points !== undefined && !isNaN(credits) && credits > 0) {
        totalPoints += points * credits;
        totalCredits += credits;
      }
    }

    return totalCredits > 0 ? totalPoints / totalCredits : NaN;
  };

  const addCalculation = (date, gpa, currentRows, currentPrior) => {
    const newCalc = {
      date,
      calculation: gpa,
      currentRows: JSON.parse(JSON.stringify(currentRows)),
      currentPriors: JSON.parse(JSON.stringify(currentPrior)),
    };
    const updated = [newCalc, ...(calculations || [])];
    setCalculations(updated);
    saveData(currentRows, currentPrior, updated);
  };

  const deleteCalculatedGrade = (index) => {
    const updated = calculations.filter((_, i) => i !== index);
    setCalculations(updated);
    saveData(rows, prior, updated);
  };

  const restoreCalculations = (index, calcs) => {
    const selected = calcs[index];
    if (!selected) return;
    const restoredRows = JSON.parse(JSON.stringify(selected.currentRows));
    const restoredPrior = JSON.parse(JSON.stringify(selected.currentPriors));
    setRows(restoredRows);
    setPrior(restoredPrior);
    saveData(restoredRows, restoredPrior, calcs);
  };

  const resetData = () => {
    const empty = [emptyRow(), emptyRow(), emptyRow(), emptyRow()];
    const emptyPrior = { priorGpa: "", priorCredits: "" };
    setRows(empty);
    setPrior(emptyPrior);
    saveData(empty, emptyPrior, calculations);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) { setDataLoading(false); return; }
    let active = true;
    setDataLoading(true);
    setLoadError("");
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.GPA, user.uid));
        if (active) {
          const data = snap.exists() ? snap.data() : {};
          const imported = location.state?.classes;
          if (imported) {
            const importedRows = imported.map((c) => ({ course: c.courseName || "", grade: c.grade || "", credits: "4" }));
            while (importedRows.length < 4) importedRows.push(emptyRow());
            setRows(importedRows);
            saveImportedDraft({ rows: importedRows, prior: data.prior || { priorGpa: "", priorCredits: "" }, calculations: data.calculations || [] });
          } else if (data.rows?.length) {
            setRows(data.rows);
          }
          setPrior(data.prior || { priorGpa: "", priorCredits: "" });
          setCalculations(data.calculations || []);
        }
      } catch {
        if (active) setLoadError("Your saved draft could not be loaded. Try again before editing to protect your saved work.");
      } finally {
        if (active) setDataLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user, loading, loadAttempt, location.key, location.state, saveImportedDraft]);

  return (
    <div className="page-shell">
      <PageHeading
        title="GPA calculator"
        description="Calculate your semester GPA or include prior credits for a cumulative result."
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
        <GpaBox
          rows={rows}
          addRow={addRow}
          removeRow={removeRow}
          updateRow={updateRow}
          calculateGPA={calculateGPA}
          resetData={resetData}
          prior={prior}
          updatePrior={updatePrior}
          calculations={calculations}
          addCalculation={addCalculation}
          deleteCalculatedGrade={deleteCalculatedGrade}
          restoreCalculations={restoreCalculations}
        />
      </>}
    </div>
  );
}

export default Gpa;
