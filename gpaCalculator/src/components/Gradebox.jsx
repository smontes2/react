import React, { useState } from "react";
import { useClasses } from "../context/ClassesContext";
import { useAuth } from "../context/AuthContext";

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

const getGradeColor = (grade) => {
  if (grade >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (grade >= 80) return "text-indigo-600 bg-indigo-50 border-indigo-200";
  if (grade >= 70) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
};

export const Gradebox = (props) => {
  const { addRow, removeRow, rows, updateRow, calculateGrade, resetData, updateClassName, className, addClass, restoreClasses } = props;
  const { classes } = useClasses();
  const { user } = useAuth();

  const [grade, setGrade] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleCalculate = () => {
    const hasValid = rows.some((r) => r.weight && r.grade);
    if (!hasValid) {
      setError("Fill in at least one assignment with a grade and weight.");
      return;
    }
    setError("");
    const result = calculateGrade();
    if (isNaN(result)) {
      setError("Could not calculate — check your values.");
      return;
    }
    setGrade(result);
    setSaved(false);
  };

  const handleSave = () => {
    if (!className.trim()) {
      setError("Enter a class name before saving.");
      return;
    }
    setError("");
    addClass(className, rows);
    setSaved(true);
  };

  const letterGrade = grade !== null ? getLetterGrade(grade) : null;
  const gradeColor = grade !== null ? getGradeColor(grade) : "";

  return (
    <div className="flex flex-col gap-5">
      {/* Class name + restore + new class */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Class name (e.g. Biology 101)"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={className || ""}
          onChange={(e) => { updateClassName(e.target.value); setSaved(false); }}
        />
        {classes.length > 0 && (
          <select
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-600"
            onChange={(e) => {
              const idx = e.target.selectedIndex - 1;
              if (idx >= 0) {
                updateClassName(classes[idx].courseName);
                restoreClasses(idx, classes);
                setSaved(false);
              }
            }}
            value={className || ""}
          >
            <option value="">Restore a saved class...</option>
            {classes.map((c, i) => (
              <option key={i} value={c.courseName}>{c.courseName}</option>
            ))}
          </select>
        )}
        <button
          onClick={() => { resetData(); setGrade(null); setError(""); setSaved(false); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shrink-0"
          title="Clear everything and start a new class"
        >
          <i className="fa-solid fa-plus text-xs text-indigo-500"></i>
          New Class
        </button>
      </div>

      {/* Assignment table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <div className="col-span-6">Assignment</div>
          <div className="col-span-2 text-center">Grade %</div>
          <div className="col-span-3 text-center">Weight</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <div key={row.id || index} className="grid grid-cols-12 items-center px-4 py-2.5 hover:bg-slate-50 transition-colors">
              <div className="col-span-6 pr-2">
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-300"
                  type="text"
                  value={row.assignment || ""}
                  placeholder={index === 0 ? "e.g. Midterm Exam" : "Assignment name"}
                  onChange={(e) => updateRow(index, "assignment", e.target.value)}
                />
              </div>
              <div className="col-span-2 px-1">
                <input
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  type="number"
                  min="0"
                  max="100"
                  value={row.grade || ""}
                  placeholder="85"
                  onChange={(e) => updateRow(index, "grade", e.target.value)}
                />
              </div>
              <div className="col-span-3 px-1">
                <input
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  type="number"
                  min="0"
                  value={row.weight || ""}
                  placeholder="25%"
                  onChange={(e) => updateRow(index, "weight", e.target.value)}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {rows.length > 1 && (
                  <button
                    onClick={() => removeRow(index)}
                    className="p-1 text-slate-300 hover:text-red-400 transition-colors rounded"
                    title="Remove row"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={addRow}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <i className="fa-solid fa-plus text-xs"></i> Add Assignment
          </button>
          <button
            onClick={() => { setGrade(null); setError(""); setSaved(false); resetData(); }}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Reset all
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <i className="fa-solid fa-circle-exclamation mr-1.5"></i>{error}
        </p>
      )}

      {/* Calculate + result + save */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
        >
          Calculate Grade
        </button>

        {grade !== null && (
          <div className={`flex-1 flex items-center justify-center gap-3 rounded-xl border px-5 py-3 ${gradeColor}`}>
            <span className="text-2xl font-bold">{grade.toFixed(1)}%</span>
            <span className="text-lg font-semibold opacity-80">{letterGrade}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!user}
          title={!user ? "Login to save classes" : ""}
          className={`sm:flex-none px-5 py-3 rounded-xl font-semibold text-sm transition-colors border ${
            !user
              ? "border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"
              : saved
              ? "border-emerald-200 text-emerald-700 bg-emerald-50"
              : "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {!user ? (
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-lock text-xs"></i> Login to Save
            </span>
          ) : saved ? (
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-check text-xs"></i> Saved!
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-floppy-disk text-xs"></i> Save Class
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
