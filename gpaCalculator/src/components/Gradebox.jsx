/* eslint-disable react/prop-types -- Props retain the existing grade calculator contract. */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useClasses } from "../context/ClassesContext";
import { useAuth } from "../context/AuthContext";
import { CalculatorRows, ErrorMessage, Icon, Notice } from "./ui/Ui";

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
  const { classes } = useClasses();
  const { user } = useAuth();
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const totalWeight = rows.reduce(
    (sum, row) => sum + (parseFloat(row.weight) || 0),
    0,
  );
  const validCount = rows.filter(
    (row) => !isNaN(parseFloat(row.grade)) && parseFloat(row.weight) > 0,
  ).length;
  const changed = () => {
    setGrade(null);
    setSaved(false);
    setError("");
  };
  const reset = () => {
    changed();
    resetData();
  };
  const handleCalculate = () => {
    const result = calculateGrade();
    if (!Number.isFinite(result)) {
      setError(
        "Enter at least one assignment grade and a weight greater than zero.",
      );
      return;
    }
    setError("");
    setGrade(result);
    setSaved(false);
  };
  const handleSave = async () => {
    if (!className.trim()) {
      setError("Enter a class name before saving.");
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
      setSaved(true);
    } catch {
      setError("Your class could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="calculator-workspace">
      <section className="calculator-editor" aria-label="Assignment editor">
        <div className="course-line">
          <label className="course-label" htmlFor="class-name">
            Class name
            <input
              id="class-name"
              type="text"
              placeholder="e.g. Biology 101"
              value={className || ""}
              onChange={(e) => {
                updateClassName(e.target.value);
                setSaved(false);
              }}
            />
          </label>
          <button className="quiet-button new-class" onClick={reset}>
            <Icon name="plus" />
            New class
          </button>
        </div>
        {classes.length > 0 && (
          <label className="restore-label" htmlFor="restore-class">
            Restore a saved class
            <select
              id="restore-class"
              value=""
              onChange={(e) => {
                if (e.target.value !== "") {
                  restoreClasses(Number(e.target.value), classes);
                  changed();
                }
              }}
            >
              <option value="">Choose a class…</option>
              {classes.map((c, i) => (
                <option key={i} value={i}>
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
              Total weight <strong>{Number(totalWeight.toFixed(2))}</strong>
            </>
          }
        />
        <Notice>
          Weights can be percentages or relative values. Your grade is
          calculated relative to the weights you enter.
        </Notice>
      </section>
      <aside className="calculator-summary" aria-label="Course grade result">
        <p className="summary-label">Your course grade</p>
        <div role="status" aria-live="polite" aria-atomic="true">
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
              ? `Based on ${validCount} assignment${validCount !== 1 ? "s" : ""} and a total weight of ${Number(totalWeight.toFixed(2))}.`
              : "Enter your assignment grades and weights, then calculate your course grade."}
          </p>
        </div>
        <ErrorMessage>{error}</ErrorMessage>
        <button className="button button-primary" onClick={handleCalculate}>
          Calculate grade
          <Icon name="arrow" />
        </button>
        <p className="result-help">
          {grade !== null
            ? "Change a value, then calculate again."
            : "Only grades with a positive weight are included."}
        </p>
        <div className="save-area">
          <h2>Keep your work.</h2>
          <p>
            {user
              ? "Save this class to restore it later or use it in your GPA calculation."
              : "Sign in to save this class, restore it later, and use it in your GPA calculation."}
          </p>
          <button
            className="button button-secondary"
            disabled={!user || saving}
            onClick={handleSave}
          >
            <Icon name={!user ? "lock" : saved ? "check" : "book"} />
            {!user
              ? "Sign in to save class"
              : saving
                ? "Saving…"
                : saved
                  ? "Saved!"
                  : "Save class"}
          </button>
          <span className="sr-only" role="status">
            {saved ? "Class saved successfully." : ""}
          </span>
          {!user && (
            <Link to="/login" className="summary-link">
              Sign in
              <Icon name="arrow" />
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
};
