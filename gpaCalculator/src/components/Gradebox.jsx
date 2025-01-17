import React from "react";
import { useState } from "react";

export const Gradebox = (props) => {
  const { addRow, rows, updateRow, calculateGrade, resetData } = props;
  const [grade, setGrade] = useState("");
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <table className="rounded-lg bg-gray-400 w-1/3 mt-8">
        <thead>
          <tr>
            <th className="border-gray-300 px-4 pt-4 text-left">Assignment</th>
            <th className="border-gray-300 px-4 pt-4 text-left">Grade(%)</th>
            <th className="border-gray-300 px-4 pt-4 text-left">Weight</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index}>
              <td className="border-gray-300 p-3">
                <input
                  className="rounded-md p-2"
                  type="text"
                  value={row.assignment || ""}
				  placeholder={index < 1 ? "e.g. Homework 1" : ""}
                  onChange={(e) =>
                    updateRow(index, "assignment", e.target.value)
                  }
                />
              </td>
              <td className="border-gray-300 p-3">
                <input
                  className="rounded-md p-2 w-full"
                  type="number"
                  value={row.grade || ""}
                  onChange={(e) => updateRow(index, "grade", e.target.value)}
                />
              </td>
              <td className="border-gray-300 p-3">
                <input
                  className="rounded-md p-2 w-full"
                  type="number"
                  value={row.weight || ""}
                  onChange={(e) => updateRow(index, "weight", e.target.value)}
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
			if(!rows[0].weight || !rows[0].grade){
				alert("Please fill out the first row");
			}
            setGrade(calculateGrade());
          }}
        >
          Calculate
        </button>
		<button
          className="mt-4 p-2 bg-red-500 text-white rounded-md"
          onClick={() => {
			setGrade(null)
			resetData()
          }}
        >
          Reset
        </button>
      </div>
	  <div className="flex justify-center items-center p-4">
		  <input type="text" value={grade ? grade : ''} disabled className="border-2 border-gray-500 rounded-md p-2"/>
	  </div>
    </div>
  );
};
