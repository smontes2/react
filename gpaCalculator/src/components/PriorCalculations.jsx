/* eslint-disable react/prop-types -- Props retain the existing history contract. */
import { Icon, Loading } from "./ui/Ui";
export const PriorCalculations = ({
  calculations,
  deleteCalculatedGrade,
  restoreCalculations,
}) => (
  <section className="calculation-history" aria-labelledby="history-heading">
    <div className="section-heading">
      <h2 id="history-heading">Calculation history</h2>
      <span>{calculations?.length || 0} calculations</span>
    </div>
    {!calculations ? (
      <Loading />
    ) : calculations.length === 0 ? (
      <div className="empty-state compact">
        <Icon name="restore" />
        <p>No calculations yet. Your results will appear here.</p>
      </div>
    ) : (
      <ul className="history-list">
        {calculations.map((calc, index) => (
          <li key={index}>
            <strong className="history-result">
              {parseFloat(calc.calculation).toFixed(2)}
            </strong>
            <div>
              <span className="history-date">{calc.date}</span>
              <span className="history-detail">
                {calc.currentRows?.filter((r) => r.grade && r.grade !== "-")
                  .length || 0}{" "}
                courses
              </span>
            </div>
            <div className="history-actions">
              <button
                className="text-button"
                onClick={() => restoreCalculations(index, calculations)}
                aria-label={`Restore calculation ${index + 1} from ${calc.date}`}
              >
                <Icon name="restore" />
                Restore
              </button>
              <button
                className="icon-button danger-action"
                onClick={() => deleteCalculatedGrade(index)}
                aria-label={`Delete calculation ${index + 1} from ${calc.date}`}
              >
                <Icon name="trash" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);
