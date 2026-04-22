import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <img
        src="/src/assets/the-office-awkward.gif"
        alt="Awkward"
        className="w-64 rounded-2xl shadow-md mb-6"
      />
      <h1 className="text-xl font-bold text-slate-900 mb-2">This page doesn't exist</h1>
      <p className="text-sm text-slate-500 mb-6">Stop snooping around.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
      >
        <i className="fa-solid fa-arrow-left text-xs"></i> Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
