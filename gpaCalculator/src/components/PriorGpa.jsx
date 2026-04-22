import React from "react";

export const PriorGpa = ({ prior, updatePrior }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 w-full">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Prior Semester Data</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-600 mb-1">Prior GPA</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4.33"
            value={prior.priorGpa || ""}
            placeholder="e.g. 3.50"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onChange={(e) => updatePrior(parseFloat(e.target.value) || "", prior.priorCredits)}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 mb-1">Total Credits</label>
          <input
            type="number"
            min="0"
            value={prior.priorCredits || ""}
            placeholder="e.g. 60"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onChange={(e) => updatePrior(prior.priorGpa, parseFloat(e.target.value) || "")}
          />
        </div>
      </div>
    </div>
  );
};
