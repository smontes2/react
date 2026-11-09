import { useState } from "react";
import { Icon, ErrorMessage } from "./ui/Ui";
import { login } from "../services/authServices";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/classes");
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <span className="auth-mark">
          <Icon name="lock" />
        </span>
        <p className="eyebrow">YOUR WORK, READY WHEN YOU ARE</p>
        <h1>Welcome back.</h1>
        <p>Sign in to your GradeVault account.</p>
      </div>
      <div className="auth-panel">
        <ErrorMessage>{error}</ErrorMessage>
        <form onSubmit={handleLogin} className="auth-form">
          <label htmlFor="auth-email">
            Email
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label htmlFor="auth-password">
            Password
            <input
              id="auth-password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button
            className="button button-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
            <Icon name="arrow" />
          </button>
          <span className="sr-only" role="status">
            {loading ? "Please wait…" : ""}
          </span>
        </form>
        <p className="auth-alternate">
          New to GradeVault? <Link to="/signup">Create an account</Link>
        </p>
      </div>
      <Link to="/grade" className="auth-guest">
        Just calculating? Continue without an account
        <Icon name="arrow" />
      </Link>
    </div>
  );
};
export default Login;
