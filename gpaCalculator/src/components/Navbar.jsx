import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authServices";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", public: true },
    { path: "/gpa", label: "GPA", public: true },
    { path: "/grade", label: "Grade", public: true },
    { path: "/classes", label: "Classes", public: false },
    { path: "/feedback", label: "Feedback", public: true },
  ];

  const handleAuth = async () => {
    setIsOpen(false);
    if (user) {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-calculator text-white text-sm"></i>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              GradeVault
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.filter((l) => l.public || user).map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <span className="text-sm text-slate-500 truncate max-w-[180px]">
                {user.email}
              </span>
            )}
            <button
              onClick={handleAuth}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                user
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-2">
          <ul className="space-y-1">
            {navLinks.filter((l) => l.public || user).map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-slate-200">
            {user && (
              <p className="text-xs text-slate-500 mb-2 px-1 truncate">{user.email}</p>
            )}
            <button
              onClick={handleAuth}
              className={`w-full text-sm font-medium px-4 py-2.5 rounded-lg transition-colors ${
                user
                  ? "border border-slate-200 text-slate-700 hover:bg-slate-100"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
