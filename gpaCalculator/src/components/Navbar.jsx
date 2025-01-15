import React from "react";
import { Link } from 'react-router-dom';

export const Navbar = () => {
	return (
		<nav className="bg-gray-800 p-4 text-white">
			<ul className="flex justify-center items-center gap-4">
				<li><Link to="/">Home</Link></li>
				<li><Link to="/gpa">GPA</Link></li>
				<li><Link to="/grade">Grade</Link></li>
			</ul>
		</nav>
	)
};