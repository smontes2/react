/* eslint-disable react/prop-types -- Props retain the existing GPA calculator contract. */
import { useRef, useState } from "react";
import { PriorGpa } from "./PriorGpa";
import { PriorCalculations } from "./PriorCalculations";
import { CalculatorRows, ErrorMessage, Icon, Notice } from "./ui/Ui";

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
// Preserve the existing GPA standing labels and thresholds.
const getGpaStanding = (gpa) => {
  if (gpa >= 3.7) return { label: "A / Excellent", tone: "grade-positive" };
  if (gpa >= 3.3) return { label: "A- / Great", tone: "grade-positive" };
  if (gpa >= 3.0) return { label: "B / Good Standing", tone: "grade-positive" };
  if (gpa >= 2.7) return { label: "B- / Above Average", tone: "grade-neutral" };
  if (gpa >= 2.0) return { label: "C / Average", tone: "grade-neutral" };
  return { label: "Below Average", tone: "grade-low" };
};
const columns = [
  { key: "course", label: "Course", placeholder: "Course name" },
  { key: "grade", label: "Grade", options: Object.keys(GRADE_POINTS) },
  { key: "credits", label: "Credits", type: "number", min: 0, max: 6 },
];
export const GpaBox = ({
  rows,
  addRow,
  updateRow,
  removeRow,
  calculateGPA,
  resetData,
  prior,
  updatePrior,
  calculations,
  addCalculation,
  deleteCalculatedGrade,
  restoreCalculations,
}) => {
  const form = useRef(null);
  const [calculation, setCalculation] = useState(null);
  const gpa = calculation?.value ?? null;
  const [showPrior, setShowPrior] = useState(false);
  const [error, setError] = useState("");
  const inputs = JSON.stringify({ rows, prior, showPrior });
  const stale = calculation !== null && calculation.inputs !== inputs;
  const changed = () => {
    setError("");
  };
  const credits = rows.reduce(
    (sum, row) =>
      sum +
      (GRADE_POINTS[row.grade] !== undefined && parseFloat(row.credits) > 0
        ? parseFloat(row.credits)
        : 0),
    0,
  );
  const handleCalculate = () => {
    if (!rows.some((r) => r.grade && r.grade !== "-" && r.credits)) {
      setError("Fill in at least one course with a grade and credits.");
      form.current.querySelector("select")?.focus();
      return;
    }
    const result = calculateGPA(showPrior);
    if (!Number.isFinite(result)) {
      setError(
        "Could not calculate — check that credits are positive numbers.",
      );
      return;
    }
    setError("");
    setCalculation({ value: result, inputs, credits: Number(credits.toFixed(2)), includePrior: showPrior });
    addCalculation(
      new Date().toLocaleDateString(),
      result.toFixed(2),
      rows,
      prior,
    );
  };
  return (
    <>
      <form
        ref={form}
        className="calculator-workspace"
        onSubmit={(event) => { event.preventDefault(); handleCalculate(); }}
      >
        <section
          className="calculator-editor gpa-editor"
          aria-label="Course editor"
        >
          <CalculatorRows
            rows={rows}
            columns={columns}
            noun="course"
            errorId={error ? "gpa-calculation-error" : undefined}
            updateRow={(...args) => {
              changed();
              updateRow(...args);
            }}
            removeRow={(i) => {
              changed();
              removeRow(i);
            }}
            addRow={() => {
              changed();
              addRow();
            }}
            reset={() => {
              changed();
              setCalculation(null);
              resetData();
            }}
            total={
              <>
                Course credits
                {' '}
                <strong>{Number(credits.toFixed(2))}</strong>
              </>
            }
          />
          <div className="prior-section">
            <label className="prior-toggle">
              <input
                type="checkbox"
                checked={showPrior}
                onChange={(e) => {
                  changed();
                  setShowPrior(e.target.checked);
                }}
                aria-controls="prior-semester-fields"
              />
              <span>Include prior semester GPA</span>
            </label>
            <fieldset
              className="prior-controls"
              id="prior-semester-fields"
              hidden={!showPrior}
              disabled={!showPrior}
            >
              <PriorGpa
                prior={prior}
                updatePrior={(...args) => {
                  changed();
                  updatePrior(...args);
                }}
              />
            </fieldset>
          </div>
          <Notice>
            Grades are weighted by credit hours. The existing scale includes A+
            at 4.33 and A at 4.00.
          </Notice>
        </section>
        <aside
          className="calculator-summary"
          aria-label="GPA result"
        >
          <p className="summary-label">
            {showPrior ? "Your cumulative GPA" : "Your semester GPA"}
          </p>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {stale && <p className="result-state">Previous result · Inputs changed</p>}
            <p className="result-number">
              {gpa !== null ? gpa.toFixed(2) : "—"}
            </p>
            {gpa !== null && (
              <p className={`gpa-standing ${getGpaStanding(gpa).tone}`}>
                {getGpaStanding(gpa).label}
              </p>
            )}
            <p className="summary-copy">
              {gpa !== null
                ? `Calculated from ${calculation.credits} course credits${calculation.includePrior ? " and your prior semester data" : ""}.`
                : "Enter your course grades and credits to see your GPA."}
            </p>
          </div>
          <ErrorMessage id="gpa-calculation-error">{error}</ErrorMessage>
          <button
            type="submit"
            className="button button-primary"
          >
            Calculate GPA
            <Icon name="arrow" />
          </button>
          <p className="result-help">
            {stale ? "Calculate again to update your result." : "Each calculation is added to your history."}
          </p>
          <div className="save-area">
            <h2>Cumulative GPA</h2>
            <p>
              Include your prior GPA and completed credits to calculate a
              cumulative result.
            </p>
          </div>
        </aside>
      </form>
      <PriorCalculations
        calculations={calculations}
        deleteCalculatedGrade={deleteCalculatedGrade}
        restoreCalculations={(...args) => {
          changed();
          setCalculation(null);
          restoreCalculations(...args);
        }}
      />
    </>
  );
};
