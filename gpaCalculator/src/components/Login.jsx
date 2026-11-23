import { useRef, useState } from "react";
import { Icon, ErrorMessage, FormField } from "./ui/Ui";
import { login } from "../services/authServices";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [credentialError, setCredentialError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordInput = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setCredentialError("");
    try {
      await login(email, password);
      navigate("/classes");
    } catch (err) {
      if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password"].includes(err.code)) {
        setCredentialError("Check your email and password, then try again.");
        passwordInput.current?.focus();
      } else {
        setError(err.code === "auth/too-many-requests"
          ? "Too many attempts. Wait a moment, then try signing in again."
          : "Could not sign in. Check your connection and try again.");
      }
    } finally { setLoading(false); }
  };

  return <div className="auth-page">
    <div className="auth-intro">
      <span className="auth-mark"><Icon name="lock" /></span>
      <h1>Sign in</h1>
      <p>Open your saved classes and calculations.</p>
    </div>
    <div className="auth-panel">
      <ErrorMessage>{error}</ErrorMessage>
      <form
        onSubmit={handleLogin}
        className="auth-form"
        aria-busy={loading}
      >
        <FormField
          id="auth-email"
          label="Email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="you@example.com"
          value={email}
          required
          onChange={(event) => { setEmail(event.target.value); setCredentialError(""); }}
        />
        <FormField
          id="auth-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          inputRef={passwordInput}
          value={password}
          error={credentialError}
          required
          onChange={(event) => { setPassword(event.target.value); setCredentialError(""); }}
        />
        <button
          className="button button-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <span
          className="sr-only"
          role="status"
        >
          {loading ? "Signing in…" : credentialError}
        </span>
      </form>
      <p className="auth-alternate">
        New to GradeVault?
        <Link to="/signup">Create an account</Link>
      </p>
    </div>
    <Link
      to="/grade"
      className="auth-guest"
    >
      Continue without an account
      <Icon name="arrow" />
    </Link>
  </div>;
};
export default Login;
