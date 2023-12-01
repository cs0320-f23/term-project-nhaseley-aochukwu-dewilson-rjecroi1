import "../styles/RegistrationForm.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <h2> This is the login form! </h2>
      <div className="login-forms">
        <form
          className="login-form"
          aria-label="You can login as a student here"
        >
          <h2> Intern </h2>
          <label></label>
          <input
            className="student-email"
            aria-label="You can enter your email here (must be Brown)"
            placeholder="Enter Brown email here"
          ></input>
          <input
            className="student-password"
            aria-label="You can enter your password here"
            placeholder="Enter password here"
          ></input>
        </form>

        <form
          className="renter-login-form"
          aria-label="You can login as a renter here"
        >
          <h2> Renter </h2>
          <label></label>
          <input
            className="renter-email"
            aria-label="You can enter your email here"
            placeholder="Enter email here"
          ></input>
          <input
            className="renter-password"
            aria-label="You can enter your password here"
            placeholder="Enter password here"
          ></input>
        </form>
      </div>
    </div>
  );
}
