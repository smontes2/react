import React from "react";
import { useState } from "react";

export const GpaBox = (props) => {
  const { rows, addRow, updateRow, calculateGPA } = props;
  const [gpa, setGpa] = useState("");

  return (
    <div className="flex flex-col justify-center items-center p-4">
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
                  onChange={(e) => updateRow(index, "credits", e.target.value)}
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
          className="mt-4 p-2 bg-green-500 text-white rounded-md"
          onClick={() => {
            if (!rows[0].grade || !rows[0].credits) {
              alert("Please fill out the first row");
            }
            console.log(gpa);
            setGpa(calculateGPA());
          }}
        >
          Calculate
        </button>
      </div>
      <div className="flex justify-center items-center p-4">
        <input
          type="text"
          disabled
          className="border-2 border-gray-500 rounded-md p-2"
          value={gpa ? gpa.toFixed(2) : ''}
        />
      </div>
    </div>
  );
};
