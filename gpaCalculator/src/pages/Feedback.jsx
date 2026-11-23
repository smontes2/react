import { useState } from "react";
import { PageHeading, Loading } from "../components/ui/Ui";
function Feedback() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="page-shell feedback-page">
      <PageHeading
        title="Feedback"
        description="Have a suggestion or found a bug? Let us know."
      />
      <div className="feedback-panel">
        {isLoading && <Loading label="Loading feedback form…" />}
        <iframe
          title="GradeVault feedback form"
          src="https://docs.google.com/forms/d/e/1FAIpQLSfE4-BseJW3nFkuKDD3xWr-yDrkLkJ2LTOldoBiY8LTLVPzpg/viewform?embedded=true"
          width="100%"
          height="1100"
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? "none" : "block", border: "none" }}
        >
          Loading…
        </iframe>
        <p className="feedback-fallback">
          Form not loading?{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfE4-BseJW3nFkuKDD3xWr-yDrkLkJ2LTOldoBiY8LTLVPzpg/viewform?embedded=true"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the feedback form in a new tab
          </a>
          .
        </p>
      </div>
    </div>
  );
}
export default Feedback;
