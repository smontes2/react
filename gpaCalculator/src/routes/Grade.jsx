import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Gradebox } from "../components/Gradebox";
import { useClasses } from "../context/ClassesContext";
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
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
  const [className, setClassName] = useState("");
  const { user, loading } = useAuth();
  const { addClass: addClassToContext } = useClasses();

  const saveData = async (currentRows, currentClass) => {
    if (!user) return;
    try {
      await setDoc(doc(db, COLLECTIONS.GRADES, user.uid), {
        rows: currentRows,
        class: currentClass,
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

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
    const updated = rows.map((r, i) => i === index ? { ...r, [field]: value } : r);
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
    addClassToContext(courseName, calculatedGrade, letter, currentRows);
  };

  const resetData = () => {
    const empty = [emptyRow(), emptyRow(), emptyRow(), emptyRow()];
    setClassName("");
    setRows(empty);
    saveData(empty, "");
  };

  useEffect(() => {
    if (loading || !user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.GRADES, user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setRows(data.rows);
          setClassName(data.class);
        }
      } catch (error) {
        console.error("Error fetching grade data:", error);
      }
    })();
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Grade Calculator</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your assignments with grades and weights to calculate your final course grade.</p>
        </div>
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
      </div>
    </div>
  );
}

export default Grade;
