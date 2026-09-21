import { useState } from "react";

function Login(props) {
  const [fields, setFields] = useState({ name: "", email: "", password: "" });

  const [isRegistering, setIsRegistering] = useState(false);

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleMode() {
    setIsRegistering((prev) => !prev);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFields((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = isRegistering ? "/auth/register" : "/auth/login";
      const payload = isRegistering
        ? fields
        : { email: fields.email, password: fields.password };

      const res = await axiosClient.post(endpoint, payload);
      props.onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error ?? "Something went wrong. Try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login">
      <h2>Your notes, wherever you sign in</h2>
      <p>
        {isRegistering
          ? "Create an account to start saving notes"
          : "Sign in to view and save your own notes"}{" "}
      </p>
      <form className="login-form" onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            name="name"
            placeholder="name"
            value={fields.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="email"
          value={fields.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={fields.password}
          onChange={handleChange}
          autoComplete={isRegistering ? "new-password" : "current-password"}
          minLength={isRegistering ? 8 : undefined}
          required
        />

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Working..."
            : isRegistering
              ? "Create Account"
              : "Sign In"}
        </button>
      </form>
      <p className="login-toggle">
        {isRegistering ? "Already have an account?" : "New here?"}
        <button type="button" className="link-button" onClick={toggleMode}>
          {isRegistering ? "Sign In" : "Create One"}
        </button>
      </p>
    </div>
  );
}

export default Login;
