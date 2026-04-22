import { useState } from "react";

function Feedback() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Feedback</h1>
          <p className="text-sm text-slate-500 mt-1">Have a suggestion or found a bug? Let us know.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfE4-BseJW3nFkuKDD3xWr-yDrkLkJ2LTOldoBiY8LTLVPzpg/viewform?embedded=true"
            width="100%"
            height="1100"
            onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? "none" : "block", border: "none" }}
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
