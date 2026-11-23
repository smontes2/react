import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Ui";
function NotFound() {
  return (
    <div className="not-found page-shell">
      <h1>Page not found</h1>
      <p>We couldn’t find this page. Let’s get you back to your grades.</p>
      <Link to="/" className="button button-primary">
        Back to home
        <Icon name="arrow" />
      </Link>
    </div>
  );
}
export default NotFound;
