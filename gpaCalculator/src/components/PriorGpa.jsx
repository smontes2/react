/* eslint-disable react/prop-types -- Props retain the existing prior GPA contract. */
export const PriorGpa = ({ prior, updatePrior }) => (
  <div className="prior-fields">
    <label htmlFor="prior-gpa">
      Prior GPA
      <input
        id="prior-gpa"
        type="number"
        step="0.01"
        min="0"
        max="4.33"
        inputMode="decimal"
        value={prior.priorGpa ?? ""}
        placeholder="e.g. 3.50"
        onChange={(e) =>
          updatePrior(
            e.target.value === "" ? "" : parseFloat(e.target.value),
            prior.priorCredits,
          )
        }
      />
    </label>
    <label htmlFor="prior-credits">
      Completed credits
      <input
        id="prior-credits"
        type="number"
        step="any"
        min="0"
        inputMode="decimal"
        value={prior.priorCredits ?? ""}
        placeholder="e.g. 60"
        onChange={(e) =>
          updatePrior(
            prior.priorGpa,
            e.target.value === "" ? "" : parseFloat(e.target.value),
          )
        }
      />
    </label>
  </div>
);
