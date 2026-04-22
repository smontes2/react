import React, { useState, useEffect } from "react";
import { GpaBox } from "../components/GpaBox";
import { useLocation } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { COLLECTIONS } from "../constants/collections";

const GRADE_POINTS = {
  "A+": 4.33, A: 4.0, "A-": 3.67,
  "B+": 3.33, B: 3.0, "B-": 2.67,
  "C+": 2.33, C: 2.0, "C-": 1.67,
  "D+": 1.33, D: 1.0, "D-": 0.67,
  F: 0.0,
};

const emptyRow = () => ({ course: "", grade: "", credits: "" });

function Gpa() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
  const [calculations, setCalculations] = useState([]);
  const [prior, setPrior] = useState({ priorGpa: "", priorCredits: "" });

  const saveData = async (currentRows, currentPrior, currentCalculations) => {
    if (!user) return;
    try {
      await setDoc(doc(db, COLLECTIONS.GPA, user.uid), {
        rows: currentRows,
        prior: currentPrior,
        calculations: currentCalculations,
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

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
    const updated = rows.map((r, i) => i === index ? { ...r, [field]: value } : r);
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
    if (loading || !user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.GPA, user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setRows(data.rows);
          setPrior(data.prior);
          setCalculations(data.calculations);
        }
      } catch (error) {
        console.error("Error fetching GPA data:", error);
      }
    })();
  }, [user, loading]);

  useEffect(() => {
    if (!location.state?.classes) return;
    const newRows = location.state.classes.map((c) => ({
      course: c.courseName || "",
      grade: c.grade || "",
      credits: "4",
    }));
    while (newRows.length < 4) newRows.push(emptyRow());
    setRows(newRows);
    saveData(newRows, prior, calculations);
  }, [location.state]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">GPA Calculator</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your courses, grades, and credit hours to calculate your GPA.</p>
        </div>
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
      </div>
    </div>
  );
}

export default Gpa;
