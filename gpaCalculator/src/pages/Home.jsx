import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <i className="fa-solid fa-star text-yellow-300 text-xs"></i>
            Free academic tools for students
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
            Track your grades,<br />
            <span className="text-indigo-200">ace your semester.</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-8">
            Calculate your GPA, track assignment grades, and manage all your courses in one place — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/grade"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              <i className="fa-solid fa-calculator text-sm"></i>
              Grade Calculator
            </Link>
            <Link
              to="/gpa"
              className="inline-flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-400 transition-colors border border-indigo-400"
            >
              <i className="fa-solid fa-chart-line text-sm"></i>
              GPA Calculator
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Everything you need</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <i className="fa-solid fa-calculator text-indigo-600 text-lg"></i>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Grade Calculator</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enter your assignments, tests, and weights to see your final course grade instantly.
            </p>
            <Link to="/grade" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-4">
              Try it <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <i className="fa-solid fa-chart-line text-purple-600 text-lg"></i>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">GPA Calculator</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Calculate your semester or cumulative GPA weighted by credit hours across all courses.
            </p>
            <Link to="/gpa" className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 mt-4">
              Try it <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <i className="fa-solid fa-book-open text-emerald-600 text-lg"></i>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Class Manager</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Save calculated grades as classes and send them directly to the GPA calculator with one click.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-4">
              Sign up free <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <i className="fa-solid fa-calculator text-white text-xs"></i>
            </div>
            <span className="text-sm font-semibold text-slate-700">GradeVault</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="mailto:smontes2022@gmail.com"
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Email"
            >
              <i className="fa-solid fa-envelope text-lg"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/samuel-montes-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="LinkedIn"
            >
              <i className="fa-brands fa-linkedin text-lg"></i>
            </a>
            <a
              href="https://github.com/smontes2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="GitHub"
            >
              <i className="fa-brands fa-square-github text-lg"></i>
            </a>
          </div>
          <p className="text-sm text-slate-400">Built for students, by a student.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
