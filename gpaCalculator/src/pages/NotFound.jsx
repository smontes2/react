import { Link } from "react-router-dom";
import awkward from "../assets/the-office-awkward.gif";
import { Icon } from "../components/ui/Ui";
function NotFound() {
  return (
    <div className="not-found page-shell">
      <p className="eyebrow">404 · PAGE NOT FOUND</p>
      <h1>A little off course.</h1>
      <p>We couldn’t find this page. Let’s get you back to your grades.</p>
      <img src={awkward} alt="An awkward moment from The Office" />
      <Link to="/" className="button button-primary">
        Back to home
        <Icon name="arrow" />
      </Link>
    </div>
  );
}
export default NotFound;
