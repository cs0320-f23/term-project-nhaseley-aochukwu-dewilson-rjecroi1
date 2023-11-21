import "../styles/RegistrationForm.css";
export default function RegistrationPage() {
  return (
    <div className="registration-page">
      <h2> This is the registration form! </h2>
      <div className="registration-forms">
        <form
          className="student-registration-form"
          aria-label="You can registration as a student here"
        >
            <h2> Intern</h2>
          <label></label>
          <input
            className="student-name"
            aria-label="You can enter your name here"
            placeholder="Enter your name here"
          ></input>
          <input
            className="student-email"
            aria-label="You can enter your email here (must be Brown)"
            placeholder="Enter your Brown email here"
          ></input>
          <input
            className="student-password"
            aria-label="You can enter your password here"
            placeholder="Enter your password here"
          ></input>
          <input
            className="student-address"
            aria-label="You can enter your work address here"
            placeholder="Enter your Work Address here"
          ></input>
        </form>

        <form
          className="renter-registration-form"
          aria-label="You can registration as a renter here"
        >
            <h2>Renter </h2>
          <label></label>
          <input
            className="renter-name"
            aria-label="You can enter your name here"
            placeholder="Enter your name here"
          ></input>
          <input
            className="renter-email"
            aria-label="You can enter your email here"
            placeholder="Enter your email here"
          ></input>
          <input
            className="renter-password"
            aria-label="You can enter your password here"
            placeholder="Enter your password here"
          ></input>
        </form>
      </div>
    </div>
  );
}
