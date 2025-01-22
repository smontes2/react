import React from "react";

export const PriorGpa = (props) => {
	const {prior, setPrior, updatePrior} = props;
	return <div className="flex flex-col justify-center items-center mt-4 gap-4">
		<input 
			type="number" 
			value={prior.priorGpa || ""} 
			placeholder="Prior semesters GPA" 
			className="border-2 border-gray-500 rounded-md p-2 " 
			onChange={(e) => updatePrior(parseFloat(e.target.value), prior.priorCredits)}
		/>
		<input 
			type="number" 
			value={prior.priorCredits || ""} 
			placeholder="Total credits" 
			className="border-2 border-gray-500 rounded-md p-2" 
			onChange={(e) => updatePrior(prior.priorGpa, parseFloat(e.target.value))}
		/>
	</div>	
};