import { useState } from "react";

function Login() {
  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);

  function toggleMode() {
    setIsRegistering((prev) => !prev);
  }

  return (
    <div className="login">
      <h2>Your notes, wherever you sign in</h2>
      <p>
        {isRegistering
          ? "Create an account to start saving notes."
          : "Sign in to see and save your own notes."}
      </p>
      <form className="login-form">
        {isRegistering && (
          <input
            type="text"
            name="name"
            placeholder="name"
            value={fields.name}
            autoComplete="name"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="email"
          value={fields.email}
          autoComplete="email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={fields.password}
          autoComplete={isRegistering ? "new-password" : "current-password"}
          required
        />
        <button type="submit">
          {isRegistering ? "Create account" : "Sign In"}
        </button>
      </form>

      <p className="login-toggle">
        {isRegistering ? "Already have an account?" : "New here?"}{" "}
        <button type="button" className="link-button" onClick={toggleMode}>
          {isRegistering ? "Sign In" : "Create one"}
        </button>
      </p>
    </div>
  );
}

export default Login;
