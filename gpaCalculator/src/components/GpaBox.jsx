import React, { useState } from "react";
import { PriorGpa } from "./PriorGpa";
import { PriorCalculations } from "./PriorCalculations";

const GRADE_POINTS = {
  "A+": 4.33, A: 4.0, "A-": 3.67,
  "B+": 3.33, B: 3.0, "B-": 2.67,
  "C+": 2.33, C: 2.0, "C-": 1.67,
  "D+": 1.33, D: 1.0, "D-": 0.67,
  F: 0.0,
};

const getGpaLabel = (gpa) => {
  if (isNaN(gpa)) return null;
  if (gpa >= 3.7) return { label: "A / Excellent", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  if (gpa >= 3.3) return { label: "A- / Great", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  if (gpa >= 3.0) return { label: "B / Good Standing", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
  if (gpa >= 2.7) return { label: "B- / Above Average", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
  if (gpa >= 2.0) return { label: "C / Average", color: "text-amber-600 bg-amber-50 border-amber-200" };
  return { label: "Below Average", color: "text-red-600 bg-red-50 border-red-200" };
};

export const GpaBox = (props) => {
  const {
    rows, addRow, updateRow, removeRow,
    calculateGPA, resetData,
    prior, updatePrior,
    calculations, addCalculation, deleteCalculatedGrade, restoreCalculations,
  } = props;

  const [gpa, setGpa] = useState(null);
  const [showPrior, setShowPrior] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    const hasValidRow = rows.some((r) => r.grade && r.grade !== "-" && r.credits);
    if (!hasValidRow) {
      setError("Fill in at least one course with a grade and credits.");
      return;
    }
    setError("");
    const result = calculateGPA(showPrior);
    if (isNaN(result)) {
      setError("Could not calculate — check that credits are numbers.");
      return;
    }
    setGpa(result);
    addCalculation(new Date().toLocaleDateString(), result.toFixed(2), rows, prior);
  };

  const gpaInfo = gpa !== null ? getGpaLabel(gpa) : null;

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* Left: calculator */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <div className="col-span-5">Course</div>
            <div className="col-span-3 text-center">Grade</div>
            <div className="col-span-3 text-center">Credits</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <div key={row.id || index} className="grid grid-cols-12 items-center px-4 py-2.5 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 pr-2">
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-300"
                    type="text"
                    value={row.course}
                    placeholder={index === 0 ? "e.g. Math 101" : "Course name"}
                    onChange={(e) => updateRow(index, "course", e.target.value)}
                  />
                </div>
                <div className="col-span-3 px-1">
                  <select
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    value={row.grade || "-"}
                    onChange={(e) => updateRow(index, "grade", e.target.value)}
                  >
                    <option value="-">—</option>
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3 px-1">
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    type="number"
                    min="0"
                    max="6"
                    value={row.credits}
                    placeholder="3"
                    onChange={(e) => updateRow(index, "credits", e.target.value)}
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

          {/* Footer controls */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={addRow}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <i className="fa-solid fa-plus text-xs"></i> Add Course
            </button>
            <button
              onClick={() => { setGpa(null); setError(""); resetData(); }}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Reset all
            </button>
          </div>
        </div>

        {/* Prior semester toggle */}
        <div className="mt-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => setShowPrior(!showPrior)}
              className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${showPrior ? "bg-indigo-600" : "bg-slate-300"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${showPrior ? "translate-x-4" : "translate-x-0"}`}></div>
            </div>
            <span className="text-sm text-slate-600">Include prior semester GPA</span>
          </label>
          {showPrior && (
            <PriorGpa prior={prior} updatePrior={updatePrior} />
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <i className="fa-solid fa-circle-exclamation mr-1.5"></i>{error}
          </p>
        )}

        {/* Calculate button + result */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
          >
            Calculate GPA
          </button>
          {gpa !== null && (
            <div className={`flex-1 flex items-center justify-center gap-3 rounded-xl border px-5 py-3 ${gpaInfo?.color}`}>
              <span className="text-2xl font-bold">{gpa.toFixed(2)}</span>
              <span className="text-sm font-medium opacity-80">{gpaInfo?.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: history */}
      <div className="xl:w-72 shrink-0">
        <PriorCalculations
          calculations={calculations}
          deleteCalculatedGrade={deleteCalculatedGrade}
          restoreCalculations={restoreCalculations}
        />
      </div>
    </div>
  );
};
