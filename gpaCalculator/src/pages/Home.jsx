import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "../components/ui/Ui";

function Home() {
  const { user } = useAuth();
  return (
    <div className="page-shell home-page">
      <section className="home-hero">
        <div>
          <p className="eyebrow">YOUR GRADES. A CLEARER PICTURE.</p>
          <h1>
            Less guesswork.
            <br />
            More perspective.
          </h1>
          <p className="home-description">
            From your next assignment to your overall GPA, make sense of your
            semester in one place.
          </p>
          <div className="hero-actions">
            <Link to="/grade" className="button button-primary">
              Calculate a grade
              <Icon name="arrow" />
            </Link>
            <Link to="/gpa" className="button button-secondary">
              Calculate your GPA
            </Link>
          </div>
          <p className="hero-note">
            Free to use. No account needed to calculate.
          </p>
        </div>
        <div className="home-tool-index" aria-label="Tools at a glance">
          <p className="eyebrow">A PLACE FOR EVERY NUMBER</p>
          <Link to="/grade">
            <span className="index-number">01</span>
            <div>
              <h2>One class</h2>
              <p>Assignments, grades, and weights.</p>
            </div>
            <Icon name="arrow" />
          </Link>
          <Link to="/gpa">
            <span className="index-number">02</span>
            <div>
              <h2>Your semester</h2>
              <p>Courses, credits, and your GPA.</p>
            </div>
            <Icon name="arrow" />
          </Link>
          <Link to={user ? "/classes" : "/signup"}>
            <span className="index-number">03</span>
            <div>
              <h2>Everything together</h2>
              <p>Save classes. Pick up where you left off.</p>
            </div>
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <section className="home-tools" aria-labelledby="tools-heading">
        <div className="home-tools-heading">
          <p className="eyebrow">SIMPLE TOOLS, USEFUL ANSWERS</p>
          <h2 id="tools-heading">Start with what you need.</h2>
        </div>
        <div className="tool-list">
          <article>
            <Icon name="calculator" />
            <h3>Grade calculator</h3>
            <p>
              Enter assignments, tests, and weights to calculate your course
              grade.
            </p>
            <Link to="/grade">
              Work out a grade
              <Icon name="arrow" />
            </Link>
          </article>
          <article>
            <Icon name="chart" />
            <h3>GPA calculator</h3>
            <p>
              Calculate your semester GPA or include prior credits for a
              cumulative result.
            </p>
            <Link to="/gpa">
              See your GPA
              <Icon name="arrow" />
            </Link>
          </article>
          <article>
            <Icon name="book" />
            <h3>Your classes</h3>
            <p>
              Save calculated grades and bring your courses into the GPA
              calculator.
            </p>
            <Link to={user ? "/classes" : "/signup"}>
              {user ? "Open your classes" : "Create a free account"}
              <Icon name="arrow" />
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
export default Home;
