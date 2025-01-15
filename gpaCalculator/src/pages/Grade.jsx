import { useState, useEffect } from "react";
import { Gradebox } from "../components/Gradebox";

function Grade() {
  const [rows, setRow] = useState([
    { assignment: "", grade: "", weight: "" },
    { assignment: "", grade: "", weight: "" },
    { assignment: "", grade: "", weight: "" },
    { assignment: "", grade: "", weight: "" },
  ]);

  const addRow = () => {
    const newRow = [...rows, { assignment: "", grade: null, weight: null }];
    setRow(newRow);
	handleSaveData(newRow)
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRow(newRows);
	handleSaveData(newRows);
  };

  const calculateGrade = () => {
	let totalWeight = 0;
	let wxg = 0;
	for(let i = 0; i < rows.length; i ++){
		totalWeight += parseFloat(rows[i].weight) || 0;
		wxg += parseFloat(rows[i].grade) * parseFloat(rows[i].weight) || 0;
	}

	return (wxg/totalWeight);
  }

  const handleSaveData = (currentRows) => {
	localStorage.setItem('gradeCalculator', JSON.stringify({rows: currentRows}))
  }
  
  useEffect(() => {
	if(!localStorage || !localStorage.getItem('gradeCalculator')){
		return
	}
	let db = []
	db = JSON.parse(localStorage.getItem('gradeCalculator'))
	setRow(db.rows)
  }, [])

  return <Gradebox addRow={addRow} rows={rows} updateRow={updateRow} calculateGrade={calculateGrade}/>;
}

export default Grade;
