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
      <h1>Brown Intern Summer Housing - Boston</h1>———<h2> Mission</h2>
      <p className="homepage-description">
        BISH Boston is a housing locator application made for students at Brown
        University seeking summer intern housing in the greater Boston area.
        Now, finding housing is as easy as a click of a button. Register below
        to see what housing opportunities await!
      </p>
      <a href="/register">
        <button className="start-button" type="start">START</button>
      </a>
    </div>
  );
}
