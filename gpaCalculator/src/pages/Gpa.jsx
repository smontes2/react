import React from "react";
import { useState, useEffect } from "react";
import { GpaBox } from "../components/GpaBox";

function Gpa() {
  const [rows, setRow] = useState([
    { course: "", grade: "", credits: "" },
    { course: "", grade: "", credits: "" },
    { course: "", grade: "", credits: "" },
    { course: "", grade: "", credits: "" },
  ]);

  const [calculations, setCalculations] = useState([]);

  const [prior, setPrior] = useState({ priorGpa: "", priorCredits: "" });

  const addRow = () => {
    const newRow = [...rows, { course: "", grade: "", credits: "" }];
    setRow(newRow);
    handleSaveData(newRow, prior, calculations);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRow(newRows);
    handleSaveData(newRows, prior, calculations);
  };

  const updatePrior = (priorGpaInput, priorCreditsInput) => {
    const newPrior = {
      priorGpa: priorGpaInput,
      priorCredits: priorCreditsInput,
    };
    setPrior(newPrior);
    handleSaveData(rows, newPrior, calculations);
  };

  const addCalculation = (d, gpa, r, p) => {
	const newCalculation = [{ date: d, calculation: gpa, currentRows: r, currentPriors: p}, ...(calculations || [])];
	setCalculations(newCalculation);
	handleSaveData(rows, prior, newCalculation);
  };

  const deleteCalculatedGrade = (index) => {
	const updateCalculationTable = calculations.filter((_, i) => i !== index);
	setCalculations(updateCalculationTable);
	handleSaveData(rows, prior, updateCalculationTable);
  };

  const restoreCalculations = (index, calculations) => {
	const selectedCalculation = calculations[index];
	if (selectedCalculation) {
		setRow(selectedCalculation.currentRows);
		setPrior(selectedCalculation.currentPriors);
		handleSaveData(selectedCalculation.currentRows, selectedCalculation.currentPriors, calculations);
	}
  }

  // Create reset function for priorCalculations
  const resetData = () => {
    const emptyRows = [
      { course: "", grade: "", credits: "" },
      { course: "", grade: "", credits: "" },
      { course: "", grade: "", credits: "" },
      { course: "", grade: "", credits: "" },
    ];
    const emptyPrior = { priorGpa: "", priorCredits: "" };
    setRow(emptyRows);
    setPrior(emptyPrior);
    handleSaveData(emptyRows, emptyPrior, calculations);
  };

  const calculateGPA = (isChecked) => {
    let totalGradePoints = 0.0;
    let totalCredits = 0.0;
    if (prior.priorGpa && prior.priorCredits && isChecked === true) {
      totalGradePoints = prior.priorCredits * prior.priorGpa;
      totalCredits = prior.priorCredits;
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].grade == "-") {
        continue;
      } else if (rows[i].grade == "A+") {
        totalGradePoints += 4.33 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "A") {
        totalGradePoints += 4 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "A-") {
        totalGradePoints += 3.67 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "B+") {
        totalGradePoints += 3.33 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "B") {
        totalGradePoints += 3 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "B-") {
        totalGradePoints += 2.67 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "C+") {
        totalGradePoints += 2.33 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "C") {
        totalGradePoints += 2 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "C-") {
        totalGradePoints += 1.67 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "D+") {
        totalGradePoints += 1.33 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "D") {
        totalGradePoints += 1 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "D-") {
        totalGradePoints += 0.67 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      } else if (rows[i].grade == "F") {
        totalGradePoints += 0 * parseFloat(rows[i].credits);
        totalCredits += parseFloat(rows[i].credits);
      }
    }
    return totalGradePoints / totalCredits;
  };

  const handleSaveData = (currentRows, currentPrior, currentCalculations) => {
    localStorage.setItem(
      "gpaCalculator",
      JSON.stringify({ rows: currentRows, prior: currentPrior, calculations: currentCalculations })
    );
  };

  useEffect(() => {
    if (!localStorage || !localStorage.getItem("gpaCalculator")) {
      return;
    }
    let db = [];
    db = JSON.parse(localStorage.getItem("gpaCalculator"));
    setRow(db.rows);
    setPrior(db.prior);
	setCalculations(db.calculations);
  }, []);

  return (
    <div className="flex justify-center">
      <div>
        <GpaBox
          rows={rows}
          addRow={addRow}
          updateRow={updateRow}
          calculateGPA={calculateGPA}
          resetData={resetData}
          prior={prior}
          setPrior={setPrior}
          updatePrior={updatePrior}
		  calculations={calculations}
		  setCalculations={setCalculations}
		  addCalculation={addCalculation}
		  deleteCalculatedGrade={deleteCalculatedGrade}
		  restoreCalculations={restoreCalculations}
        />
      </div>
    </div>
  );
}

export default Gpa;
