import React from "react";

export const PriorCalculations = (props) => {
  const { calculations, deleteCalculatedGrade, restoreCalculations } = props;
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-medium pb-2">Prior Calculations</h1>
      <table className="mt-2">
        <thead>
          <tr>
            <th>Date</th>
            <th>Calculation</th>
          </tr>
        </thead>
        <tbody>
          {calculations.map((calculation, index) => (
            <tr key={calculation.id || index}>
              <td className="border-gray-300 p-3">
                <input
                  className="rounded-md p-2 w-24 border-2 border-black"
                  type="text"
                  value={calculation.date || ""}
                  disabled
                />
              </td>
              <td className="border-gray-300 p-3">
                <input
                  className="rounded-md p-2 w-full border-2 border-black"
                  type="text"
                  value={calculation.calculation || ""}
                  disabled
                />
              </td>
              <td className="pr-2">
                {/* This will eventually work. The intended goal is to click the button and re-add the grades from that date to the calculator */}
                <button onClick={() => {
					restoreCalculations(index, calculations)
				}}>
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
              </td>
              <td>
                <button onClick={() => {
					deleteCalculatedGrade(index);
				}}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
