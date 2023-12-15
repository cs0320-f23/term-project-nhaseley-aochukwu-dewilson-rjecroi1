import "../styles/Homepage.css";

/**
 * HomePage Component
 * 
 * This component represents the landing page of the application.
 * It provides an overview of the mission of the housing locator application
 * and encourages users to start exploring housing opportunities.
 */
export default function HomePage() {
  return (
    <div className="homepage">
      <h1>Brown Intern Summer Housing - Boston</h1>—————<h2> Mission</h2>
      <p>
        Brown Intern Summer Housing - Boston (BISH - Boston) is a housing
        locator application <br></br> made for students at Brown University
        seeking summer intern housing in the Boston area.<br></br> Now, finding
        housing is as easy as a click of a button. Login below to see <br></br>
        what housing opportunities await!
      </p>
      <a href="/register">
        <button type="start">START</button>
      </a>
    </div>
  );
}
