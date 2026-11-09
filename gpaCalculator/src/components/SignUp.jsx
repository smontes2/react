import { useState } from "react";
import { Icon, ErrorMessage } from "./ui/Ui";
import { signUp } from "../services/authServices";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      navigate("/classes");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters.");
          break;
        default:
          setError("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <span className="auth-mark">
          <Icon name="book" />
        </span>
        <p className="eyebrow">YOUR WORK, READY WHEN YOU ARE</p>
        <h1>Create an account</h1>
        <p>Save your classes and pick up where you left off.</p>
      </div>
      <div className="auth-panel">
        <ErrorMessage>{error}</ErrorMessage>
        <form onSubmit={handleSignUp} className="auth-form">
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
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label htmlFor="auth-confirm">
            Confirm password
            <input
              id="auth-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password again"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>
          <button
            className="button button-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
            <Icon name="arrow" />
          </button>
          <span className="sr-only" role="status">
            {loading ? "Please wait…" : ""}
          </span>
        </form>
        <p className="auth-alternate">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
      <Link to="/grade" className="auth-guest">
        Just calculating? Continue without an account
        <Icon name="arrow" />
      </Link>
    </div>
  );
};
export default SignUp;
