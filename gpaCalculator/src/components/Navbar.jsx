import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authServices";
import { Brand, Icon } from "./ui/Ui";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuButton = useRef(null);
  const links = [
    { path: "/", label: "Home" },
    { path: "/grade", label: "Grade calculator" },
    { path: "/gpa", label: "GPA calculator" },
    ...(user ? [{ path: "/classes", label: "Your classes" }] : []),
  ];

  useEffect(() => {
    setIsOpen(false);
    setError("");
  }, [location.pathname]);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    };
    const media = window.matchMedia("(min-width: 900px)");
    const resize = () => {
      if (media.matches) setIsOpen(false);
    };
    document.addEventListener("keydown", close);
    media.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", close);
      media.removeEventListener("change", resize);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
      setIsOpen(false);
      navigate("/");
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };
  const account = (
    <>
      {user ? (
        <>
          <span className="account-email" title={user.email}>
            {user.email}
          </span>
          <button className="button button-secondary" onClick={handleLogout} disabled={signingOut}>
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="sign-in">
            Sign in
          </Link>
          <Link to="/signup" className="button button-secondary signup-link">
            Create account
          </Link>
        </>
      )}
    </>
  );
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <Brand />
        <div className="desktop-links">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end>
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="desktop-account">{account}</div>
        <button
          ref={menuButton}
          className="menu-button icon-button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          <Icon name={isOpen ? "close" : "menu"} />
        </button>
      </nav>
      <div
        id="mobile-navigation"
        className="mobile-navigation"
        hidden={!isOpen}
      >
        <nav aria-label="Mobile navigation">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mobile-account">{account}</div>
      </div>
      {error && (
        <p role="alert" className="nav-error">
          {error}
        </p>
      )}
    </header>
  );
};
