import { useState } from "react";
import { useClasses } from "../context/ClassesContext";
import { useNavigate, Link } from "react-router-dom";
import { PageHeading, Icon, Loading, ErrorMessage } from "../components/ui/Ui";

function Classes() {
  const { classes, removeClass, loading } = useClasses();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(null);
  const handleRedirect = () => {
    const withLetterGrades = classes.map((c) => ({
      ...c,
      grade: c.letterGrade,
    }));
    navigate("/gpa", { state: { classes: withLetterGrades } });
  };
  const handleRemove = async (index) => {
    setError("");
    setRemoving(index);
    try {
      await removeClass(index);
    } catch {
      setError("Could not remove this class. Please try again.");
    } finally {
      setRemoving(null);
    }
  };
  return (
    <div className="page-shell">
      <PageHeading
        title="Your work, all together."
        description="Saved course grades, ready when you need them."
        eyebrow="YOUR CLASSES"
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="classes-toolbar">
            <p>
              {classes.length} saved class{classes.length !== 1 ? "es" : ""}
            </p>
            <div>
              <Link className="button button-secondary" to="/grade">
                <Icon name="plus" />
                Add a class
              </Link>
              {classes.length > 0 && (
                <button
                  className="button button-primary"
                  onClick={handleRedirect}
                >
                  Calculate GPA
                  <Icon name="arrow" />
                </button>
              )}
            </div>
          </div>
          <ErrorMessage>{error}</ErrorMessage>
          {classes.length === 0 ? (
            <div className="empty-state">
              <Icon name="book" />
              <h2>A place for your classes.</h2>
              <p>
                Calculate a course grade, then save it here to use it again.
              </p>
              <Link to="/grade" className="button button-primary">
                Open grade calculator
                <Icon name="arrow" />
              </Link>
            </div>
          ) : (
            <section className="classes-list" aria-label="Saved classes">
              <div className="class-list-heading" aria-hidden="true">
                <span>Course</span>
                <span>Grade</span>
                <span>Letter</span>
                <span />
              </div>
              {classes.map((row, index) => (
                <div className="class-list-row" key={row.id || index}>
                  <h2>{row.courseName || "Untitled Class"}</h2>
                  <span className="class-grade">
                    <span className="mobile-field-label">Grade</span>
                    {typeof row.grade === "number"
                      ? row.grade.toFixed(1)
                      : row.grade}
                    %
                  </span>
                  <span
                    className={`class-letter ${row.letterGrade?.startsWith("A") || row.letterGrade?.startsWith("B") ? "grade-positive" : "grade-neutral"}`}
                  >
                    <span className="sr-only">Letter grade </span>
                    {row.letterGrade || "—"}
                  </span>
                  <button
                    className="icon-button danger-action"
                    disabled={removing !== null}
                    onClick={() => handleRemove(index)}
                    aria-label={`Remove ${row.courseName || "untitled class"}`}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
export default Classes;
