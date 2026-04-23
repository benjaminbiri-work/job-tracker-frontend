import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submitLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(loginForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await register(registerForm);
      setMessage(res.message);
      setMode("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Job Tracker</h1>
        <p className="muted">Bidder accounts are inactive by default until admin approval.</p>

        <div className="tab-row">
          <button className={mode === "login" ? "tab active" : "tab"} type="button" onClick={() => setMode("login")}>Login</button>
          <button className={mode === "register" ? "tab active" : "tab"} type="button" onClick={() => setMode("register")}>Register</button>
        </div>

        {error ? <div className="alert error">{error}</div> : null}
        {message ? <div className="alert success">{message}</div> : null}

        {mode === "login" ? (
          <form className="form-grid" onSubmit={submitLogin}>
            <label><span>Email</span><input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} /></label>
            <label><span>Password</span><input type="password" required value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} /></label>
            <button disabled={loading} type="submit">{loading ? "Signing in..." : "Login"}</button>
          </form>
        ) : (
          <form className="form-grid" onSubmit={submitRegister}>
            <label><span>Name</span><input required value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} /></label>
            <label><span>Email</span><input type="email" required value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} /></label>
            <label><span>Password</span><input type="password" minLength="6" required value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} /></label>
            <button disabled={loading} type="submit">{loading ? "Creating..." : "Register"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
