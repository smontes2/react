/* eslint-disable react/prop-types -- UI props follow this application's existing JavaScript component contracts. */
import { useId } from "react";
import { Link } from "react-router-dom";

const paths = {
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 3h1m6 0h1" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  trash: (
    <>
      <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />
    </>
  ),
  restore: (
    <>
      <path d="M3 11a9 9 0 1 1 3 8M3 4v7h7M12 7v5l3 2" />
    </>
  ),
  book: (
    <>
      <path d="M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2z" />
    </>
  ),
  chart: (
    <>
      <path d="M4 3v17h17M8 15l4-5 4 2 5-7" />
    </>
  ),
};

export function Icon({ name, className = "" }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.calculator}
    </svg>
  );
}
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="GradeVault home">
      <span className="brand-mark">
        <Icon name="calculator" />
      </span>
      GradeVault
    </Link>
  );
}
export function PageHeading({
  title,
  description,
  eyebrow = "A LITTLE CLARITY FOR YOUR SEMESTER",
  note,
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {note && <div className="heading-note">{note}</div>}
    </div>
  );
}
export function AppFooter() {
  return (
    <footer className="app-footer">
      <span>GradeVault · Built for students, by a student.</span>
      <div>
        <a href="mailto:smontes2022@gmail.com">Email</a>
        <a
          href="https://www.linkedin.com/in/samuel-montes-"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/smontes2"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
export function RelatedTool({ to, title, description, label }) {
  return (
    <section className="related-tool" aria-label="Related tool">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Link to={to}>
        {label}
        <Icon name="arrow" />
      </Link>
    </section>
  );
}
export function Notice({ children }) {
  return (
    <div className="editor-note">
      <Icon name="info" />
      <p>{children}</p>
    </div>
  );
}
export function ErrorMessage({ children }) {
  return children ? (
    <p role="alert" className="error-message">
      {children}
    </p>
  ) : null;
}
export function Loading({ label = "Loading your work…" }) {
  return (
    <p role="status" className="loading-state">
      <span className="loading-dot" />
      {label}
    </p>
  );
}

/** Shared assignment/course editor; each field retains its own accessible label on every viewport. */
export function CalculatorRows({
  rows,
  columns,
  updateRow,
  removeRow,
  addRow,
  reset,
  noun,
  total,
}) {
  const id = useId();
  return (
    <>
      <div className="section-heading">
        <h2>{noun === "assignment" ? "Assignments" : "Courses"}</h2>
        <span>
          {rows.length} {noun}
          {rows.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="table-heading" aria-hidden="true">
        <span>#</span>
        {columns.map((c) => (
          <span key={c.key}>{c.label}</span>
        ))}
        <span />
      </div>
      <div className="calculator-rows">
        {rows.map((row, index) => (
          <div className="calculator-row" key={row.id || index}>
            <span className="row-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {columns.map((c) => (
              <div className="calculator-field" key={c.key}>
                <label htmlFor={`${id}-${index}-${c.key}`}>{c.label}</label>
                {c.options ? (
                  <select
                    id={`${id}-${index}-${c.key}`}
                    aria-label={`${c.label} for ${noun} ${index + 1}`}
                    value={row[c.key] || "-"}
                    onChange={(e) => updateRow(index, c.key, e.target.value)}
                  >
                    <option value="-">Select</option>
                    {c.options.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`${id}-${index}-${c.key}`}
                    aria-label={`${c.label} for ${noun} ${index + 1}`}
                    type={c.type || "text"}
                    inputMode={c.type === "number" ? "decimal" : undefined}
                    min={c.min}
                    max={c.max}
                    step={c.type === "number" ? "any" : undefined}
                    placeholder={c.placeholder}
                    value={row[c.key] ?? ""}
                    onChange={(e) => updateRow(index, c.key, e.target.value)}
                    autoComplete="off"
                  />
                )}
                {c.unit && (
                  <span className="field-unit" aria-hidden="true">
                    {c.unit}
                  </span>
                )}
              </div>
            ))}
            <button
              type="button"
              className="icon-button remove-row"
              onClick={() => removeRow(index)}
              disabled={rows.length <= 1}
              aria-label={`Remove ${noun} ${index + 1}`}
            >
              <Icon name="close" />
            </button>
          </div>
        ))}
      </div>
      <div className="table-actions">
        <button type="button" className="text-button" onClick={addRow}>
          <Icon name="plus" />
          Add {noun}
        </button>
        <div className="table-secondary">
          {total && <span>{total}</span>}
          <button type="button" className="quiet-button" onClick={reset}>
            Reset all
          </button>
        </div>
      </div>
    </>
  );
}
