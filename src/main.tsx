import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { App } from "./App";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ErrorFallback } from "./components/ErrorFallback";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
