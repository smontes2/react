import { useRef, useState } from "react";
import { Icon, ErrorMessage, FormField } from "./ui/Ui";
import { signUp } from "../services/authServices";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmInput = useRef(null);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setFieldErrors({});
    if (password !== confirm) {
      setFieldErrors({ confirm: "Passwords do not match. Enter the same password in both fields." });
      confirmInput.current?.focus();
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/classes");
    } catch (err) {
      if (["auth/email-already-in-use", "auth/invalid-email"].includes(err.code)) {
        setFieldErrors({ email: err.code === "auth/email-already-in-use"
          ? "An account with this email already exists. Sign in instead."
          : "Enter a valid email address." });
        emailInput.current?.focus();
      } else if (err.code === "auth/weak-password") {
        setFieldErrors({ password: "Use a password with at least 6 characters." });
        passwordInput.current?.focus();
      } else {
        setError("Could not create your account. Check your connection and try again.");
      }
    } finally { setLoading(false); }
  };

  return <div className="auth-page">
    <div className="auth-intro">
      <span className="auth-mark"><Icon name="book" /></span>
      <h1>Create an account</h1>
      <p>Save your classes and pick up where you left off.</p>
    </div>
    <div className="auth-panel">
      <ErrorMessage>{error}</ErrorMessage>
      <form
        onSubmit={handleSignUp}
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
          inputRef={emailInput}
          error={fieldErrors.email}
          required
          onChange={(event) => { setEmail(event.target.value); setFieldErrors({}); }}
        />
        <FormField
          id="auth-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          inputRef={passwordInput}
          error={fieldErrors.password}
          hint="Use at least 6 characters."
          minLength={6}
          required
          onChange={(event) => { setPassword(event.target.value); setFieldErrors({}); }}
        />
        <FormField
          id="auth-confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          inputRef={confirmInput}
          error={fieldErrors.confirm}
          required
          onChange={(event) => { setConfirm(event.target.value); setFieldErrors({}); }}
        />
        <button
          className="button button-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
        <span
          className="sr-only"
          role="status"
        >
          {loading ? "Creating account…" : Object.values(fieldErrors).join(" ")}
        </span>
      </form>
      <p className="auth-alternate">
        Already have an account?
        <Link to="/login">Sign in</Link>
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
export default SignUp;
