function Home() {
	return <div className="flex flex-col justify-center items-center mx-10">
		<div className="w-1/2">
			<h1 className="text-center text-2xl font-bold p-4">Welcome</h1>
			<p className="text-wrap">
				This site contains two calculators. One for grades and one for GPA.
				This project is the groundwork for bigger plans to make an entire 
				GradeBook which stores all of your grades in one place. I am practicing
				react skills so take that in account. For this project, I am using TailwindCSS 
				for simple and fast design. Feel free to look around and play with the calculators. 
			</p>
		</div>
		<div className="my-4">
			<h2 className="text-lg font-bold">Feel free to contact me with questions!</h2>
			<div className="flex justify-center gap-4">
				<a className="text-2xl" href="mailto:smontes2022@gmail.com"><i class="fa-solid fa-envelope"></i></a>
				<a className="text-2xl" href="https://www.linkedin.com/in/samuel-montes-" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
				<a className="text-2xl" href="https://github.com/smontes2" target="_blank"><i class="fa-brands fa-square-github"></i></a>
			</div>
		</div>
	</div>
	p
}

export default Home;