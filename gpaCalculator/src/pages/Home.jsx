import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "../components/ui/Ui";

function Home() {
  const { user } = useAuth();
  const tools = [
    { to: "/grade", icon: "calculator", title: "Grade calculator",
      description: "Calculate a course grade from your assignments, tests, and weights." },
    { to: "/gpa", icon: "chart", title: "GPA calculator",
      description: "Combine course grades and credits for a semester or cumulative GPA." },
    { to: user ? "/classes" : "/signup", icon: "book", title: "Your classes",
      description: user ? "Open your saved classes and bring them into your GPA calculation."
        : "Create a free account to save classes and pick up where you left off." },
  ];
  return (
    <div className="page-shell home-page">
      <section className="home-intro">
        <h1>A clearer picture of your semester.</h1>
        <p className="home-description">Work out a course grade, calculate your GPA, and keep your classes in one place.</p>
      </section>
      <section
        className="home-tools"
        aria-label="Choose a tool"
      >
        {tools.map((tool) => <Link
          className="tool-link"
          to={tool.to}
          key={tool.to}
        >
          <span className="tool-icon"><Icon name={tool.icon} /></span>
          <div>
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
          </div>
          <Icon name="arrow" />
        </Link>)}
      </section>
      <p className="home-note">Both calculators are free to use. An account is only needed to save your work.</p>
    </div>
  );
}
export default Home;
