import "../styles/Homepage.css";

export default function HomePage() {
  return (
    <div className="homepage">
      <h1>Brown Intern Summer Housing - Boston</h1>—————<h2> Mission</h2>
      <p>
        Brown Intern Summer Housing - Boston (BISH - Boston) is a housing
        locator application <br></br> made for students at Brown University
        seeking summer intern housing in the Boston area.<br></br> Now, finding
        housing is as easy as a click of a button. Login below to see <br></br>
        what housing opportunities awaits!
      </p>
      <a href="/login">
        <button type="start">LOGIN</button>
      </a>
    </div>
  );
}
