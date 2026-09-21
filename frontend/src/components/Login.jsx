function Login() {
  return (
    <div className="login">
      <form className="login-form">
        <input type="text" name="name" placeholder="name" />
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Login;
