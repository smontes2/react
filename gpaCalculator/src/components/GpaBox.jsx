import React from "react";
import { PriorGpa } from "./PriorGpa";
import { PriorCalculations } from "./PriorCalculations";
import { useState } from "react";

export const GpaBox = (props) => {
  const {
    rows,
    addRow,
    updateRow,
    calculateGPA,
    resetData,
    prior,
    setPrior,
    updatePrior,
    calculations,
    addCalculation,
	deleteCalculatedGrade,
	restoreCalculations,
  } = props;
  const [gpa, setGpa] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex">
      <div className="flex flex-col justify-start items-center p-4">
        <table className="rounded-lg bg-gray-400 w-1/3 mt-8">
          <thead>
            <tr>
              <th className="border-gray-300 px-4 pt-4 text-left">Course</th>
              <th className="border-gray-300 px-4 pt-4 text-left">Grade</th>
              <th className="border-gray-300 px-4 pt-4 text-left">Credit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || index}>
                <td className="border-gray-300 p-3">
                  <input
                    className="rounded-md p-2"
                    type="text"
                    value={row.course}
                    placeholder={index < 1 ? "e.g. Math" : ""}
                    onChange={(e) => updateRow(index, "course", e.target.value)}
                  />
                </td>
                <td className="border-gray-300 p-3">
                  <select
                    name="grade"
                    id="grade"
                    className="rounded-md p-2 w-full"
                    value={row.grade || ""}
                    onChange={(e) => updateRow(index, "grade", e.target.value)}
                  >
                    <option value="-">-</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="D+">D+</option>
                    <option value="D">D</option>
                    <option value="D-">D-</option>
                    <option value="F">F</option>
                  </select>
                </td>
                <td className="border-gray-300 p-3">
                  <input
                    className="rounded-md p-2 w-full"
                    type="number"
                    value={row.credits}
                    onChange={(e) =>
                      updateRow(index, "credits", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4">
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              addRow();
            }}
          >
            Add Row
          </button>
          <button
            className="mt-4 p-2 bg-red-500 text-white rounded-md"
            onClick={() => {
              setGpa("");
              resetData();
            }}
          >
            Reset
          </button>
        </div>
        <div className="mt-4 flex flex-col justify-center items-center">
          <p>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                setIsChecked(!isChecked);
              }}
            />{" "}
            Add GPA from prior semesters
          </p>
          {isChecked && (
            <PriorGpa
              prior={prior}
              setPrior={setPrior}
              updatePrior={updatePrior}
            />
          )}
        </div>
        <div className="flex flex-col justify-center items-center p-4">
          <button
            className="p-2 bg-green-500 text-white rounded-md"
            onClick={() => {
              if (!rows[0].grade || !rows[0].credits) {
                alert("Please fill out the first row");
              } else {
                const currentDate = new Date().toLocaleDateString();
                const calculatedGpa = calculateGPA(isChecked);
                setGpa(calculatedGpa);
                addCalculation(currentDate, calculatedGpa.toFixed(2), rows, prior);
              }
            }}
          >
            Calculate
          </button>
          <input
            type="text"
            disabled
            className="border-2 border-gray-500 rounded-md p-2 mt-4"
            value={gpa ? gpa.toFixed(2) : ""}
          />
        </div>
      </div>
      <div className="flex flex-col justify-start items-center p-4 mt-8">
        {(calculations && calculations.length > 0 && (
          <PriorCalculations calculations={calculations} deleteCalculatedGrade={deleteCalculatedGrade} restoreCalculations={restoreCalculations}/>
        ))}
      </div>
    </div>
  );
};
