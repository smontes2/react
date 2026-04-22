import React from "react";

export const PriorCalculations = ({ calculations, deleteCalculatedGrade, restoreCalculations }) => {
  if (!calculations) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getGpaColor = (gpa) => {
    const val = parseFloat(gpa);
    if (val >= 3.5) return "text-emerald-600 bg-emerald-50";
    if (val >= 3.0) return "text-indigo-600 bg-indigo-50";
    if (val >= 2.0) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="w-full">
      <h2 className="text-base font-semibold text-slate-900 mb-3">Calculation History</h2>
      {calculations.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center">
          <i className="fa-regular fa-clock-rotate-left text-slate-300 text-3xl mb-2"></i>
          <p className="text-sm text-slate-400">No calculations yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {calculations.map((calc, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-lg shrink-0 ${getGpaColor(calc.calculation)}`}>
                  {parseFloat(calc.calculation).toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 truncate">{calc.date}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => restoreCalculations(index, calculations)}
                  className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Restore"
                >
                  <i className="fa-solid fa-rotate-right text-sm"></i>
                </button>
                <button
                  onClick={() => deleteCalculatedGrade(index)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <i className="fa-solid fa-trash text-sm"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
