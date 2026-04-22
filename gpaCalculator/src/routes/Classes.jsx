import { useClasses } from "../context/ClassesContext";
import { useNavigate, Link } from "react-router-dom";

const getGradeColor = (letter) => {
  if (!letter) return "bg-slate-100 text-slate-500";
  if (letter.startsWith("A")) return "bg-emerald-100 text-emerald-700";
  if (letter.startsWith("B")) return "bg-indigo-100 text-indigo-700";
  if (letter.startsWith("C")) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-600";
};

function Classes() {
  const { classes, removeClass, loading } = useClasses();
  const navigate = useNavigate();

  const handleRedirect = () => {
    const withLetterGrades = classes.map((c) => ({ ...c, grade: c.letterGrade }));
    navigate("/gpa", { state: { classes: withLetterGrades } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Classes</h1>
            <p className="text-sm text-slate-500 mt-1">
              {classes.length > 0
                ? `${classes.length} saved class${classes.length !== 1 ? "es" : ""}`
                : "No saved classes yet"}
            </p>
          </div>
          {classes.length > 0 && (
            <button
              onClick={handleRedirect}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm"
            >
              <i className="fa-solid fa-chart-line text-xs"></i>
              Calculate GPA
            </button>
          )}
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-book-open text-slate-400 text-xl"></i>
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">No classes saved</h3>
            <p className="text-sm text-slate-400 mb-5">Use the Grade Calculator to calculate and save your class grades.</p>
            <Link
              to="/grade"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <i className="fa-solid fa-calculator text-xs"></i>
              Go to Grade Calculator
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((row, index) => (
              <div
                key={row.id || index}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug flex-1 min-w-0 truncate">
                    {row.courseName || "Untitled Class"}
                  </h3>
                  <button
                    onClick={() => removeClass(index)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Remove class"
                  >
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Grade</p>
                    <p className="text-lg font-bold text-slate-800">
                      {typeof row.grade === "number" ? row.grade.toFixed(1) : row.grade}%
                    </p>
                  </div>
                  <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${getGradeColor(row.letterGrade)}`}>
                    {row.letterGrade || "?"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Classes;
