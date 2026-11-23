/* eslint-disable react/prop-types -- Props retain the existing grade calculator contract. */
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useClasses } from "../context/ClassesContext";
import { useAuth } from "../context/AuthContext";
import { CalculatorRows, ConfirmAction, ErrorMessage, Icon, Notice } from "./ui/Ui";

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
const columns = [
  { key: "assignment", label: "Assignment", placeholder: "Assignment name" },
  {
    key: "grade",
    label: "Grade %",
    type: "number",
    min: 0,
    max: 100,
    unit: "%",
  },
  { key: "weight", label: "Weight", type: "number", min: 0 },
];

export const Gradebox = ({
  addRow,
  removeRow,
  rows,
  updateRow,
  calculateGrade,
  resetData,
  updateClassName,
  className,
  addClass,
  restoreClasses,
}) => {
  const { classes, loading: classesLoading, loadError: classesError, retry: retryClasses } = useClasses();
  const { user } = useAuth();
  const form = useRef(null);
  const [calculation, setCalculation] = useState(null);
  const grade = calculation?.value ?? null;
  const stale = calculation !== null && calculation.inputs !== JSON.stringify(rows);
  const [error, setError] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const saved = savedSnapshot === JSON.stringify({ rows, className });
  const [saving, setSaving] = useState(false);
  const totalWeight = rows.reduce(
    (sum, row) => sum + (parseFloat(row.weight) || 0),
    0,
  );
  const validCount = rows.filter(
    (row) => !isNaN(parseFloat(row.grade)) && parseFloat(row.weight) > 0,
  ).length;
  const changed = () => {
    setSavedSnapshot(null);
    setError("");
  };
  const reset = () => {
    changed();
    setCalculation(null);
    resetData();
  };
  const handleCalculate = () => {
    const result = calculateGrade();
    if (!Number.isFinite(result)) {
      setError("Enter at least one assignment grade and a weight greater than zero.");
      form.current.querySelector('input[type="number"]')?.focus();
      return;
    }
    setError("");
    setCalculation({ value: result, inputs: JSON.stringify(rows), count: validCount, weight: Number(totalWeight.toFixed(2)) });
    setSavedSnapshot(null);
  };
  const handleSave = async () => {
    if (!form.current.reportValidity()) return;
    if (!className.trim()) {
      setError("Enter a class name before saving.");
      form.current.querySelector("#class-name")?.focus();
      return;
    }
    if (!Number.isFinite(calculateGrade())) {
      setError("Enter a grade and a positive weight before saving.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await addClass(className, rows);
      setSavedSnapshot(JSON.stringify({ rows, className }));
      setCalculation({ value: calculateGrade(), inputs: JSON.stringify(rows), count: validCount, weight: Number(totalWeight.toFixed(2)) });
    } catch {
      setError("Your class could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form
      ref={form}
      className="calculator-workspace"
      onSubmit={(event) => { event.preventDefault(); handleCalculate(); }}
    >
      <section
        className="calculator-editor"
        aria-label="Assignment editor"
      >
        <div className="course-line">
          <label
            className="course-label"
            htmlFor="class-name"
          >
            Class name
            <input
              id="class-name"
              name="class-name"
              autoComplete="off"
              type="text"
              placeholder="e.g. Biology 101"
              value={className || ""}
              onChange={(e) => {
                updateClassName(e.target.value);
                setSavedSnapshot(null);
              }}
            />
          </label>
          <ConfirmAction
            className="quiet-button new-class"
            title="Start a new class?"
            description="This clears the current class name and assignments. Your saved classes will remain available."
            confirmLabel="New class"
            onConfirm={reset}
          >
            New class
          </ConfirmAction>
        </div>
        {classes.length > 0 && (
          <label
            className="restore-label"
            htmlFor="restore-class"
          >
            Restore a saved class
            <select
              id="restore-class"
              value=""
              onChange={(e) => {
                if (e.target.value !== "") {
                  restoreClasses(Number(e.target.value), classes);
                  changed();
                  setCalculation(null);
                }
              }}
            >
              <option value="">Choose a class…</option>
              {classes.map((c, i) => (
                <option
                  key={i}
                  value={i}
                >
                  {c.courseName}
                </option>
              ))}
            </select>
          </label>
        )}
        <CalculatorRows
          rows={rows}
          columns={columns}
          noun="assignment"
          errorId={error ? "grade-calculation-error" : undefined}
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
          reset={reset}
          total={
            <>
              Total weight
              {' '}
              <strong>{Number(totalWeight.toFixed(2))}</strong>
            </>
          }
        />
        <Notice>
          Weights can be percentages or relative values. Your grade is
          calculated relative to the weights you enter.
        </Notice>
      </section>
      <aside
        className="calculator-summary"
        aria-label="Course grade result"
      >
        <p className="summary-label">Your course grade</p>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {stale && <p className="result-state">Previous result · Inputs changed</p>}
          <p className="result-number">
            {grade !== null ? (
              <>
                {grade.toFixed(1)}
                <span>%</span>
              </>
            ) : (
              "—"
            )}
          </p>
          {grade !== null && (
            <div className="letter-grade">
              <strong
                className={
                  grade >= 80
                    ? "grade-positive"
                    : grade >= 60
                      ? "grade-neutral"
                      : "grade-low"
                }
              >
                {getLetterGrade(grade)}
              </strong>
              <span>Letter grade</span>
            </div>
          )}
          <p className="summary-copy">
            {grade !== null
              ? `Based on ${calculation.count} assignment${calculation.count !== 1 ? "s" : ""} and a total weight of ${calculation.weight}.`
              : "Enter your assignment grades and weights, then calculate your course grade."}
          </p>
        </div>
        <ErrorMessage id="grade-calculation-error">{error}</ErrorMessage>
        <button
          type="submit"
          className="button button-primary"
        >
          Calculate grade
          <Icon name="arrow" />
        </button>
        <p className="result-help">
          {grade !== null
            ? stale ? "Calculate again to update your result." : "Change a value, then calculate again."
            : "Only grades with a positive weight are included."}
        </p>
        <div className="save-area">
          <h2>Save this class</h2>
          <p>
            {user
              ? "Save this class to restore it later or use it in your GPA calculation."
              : "Sign in to save this class, restore it later, and use it in your GPA calculation."}
          </p>
          {user && classesError && <>
            <ErrorMessage>{classesError}</ErrorMessage>
            <button
              type="button"
              className="text-button"
              onClick={retryClasses}
            >
              Try again
            </button>
          </>}
          {user ? <button
            type="button"
            className="button button-secondary"
            disabled={saving || classesLoading || Boolean(classesError)}
            onClick={handleSave}
          >
            <Icon name={saved ? "check" : "book"} />
            {classesLoading ? "Loading saved classes…" : saving ? "Saving…" : saved ? "Class saved" : "Save class"}
          </button> : <Link
            to="/login"
            className="button button-secondary"
          >
            Sign in to save
          </Link>}
          <span
            className="sr-only"
            role="status"
          >
            {saved ? "Class saved successfully." : ""}
          </span>
        </div>
      </aside>
    </form>
  );
};
