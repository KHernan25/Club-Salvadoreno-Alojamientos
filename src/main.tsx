import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import user activation helper for debugging (development only)
if (import.meta.env.DEV) {
  import("./utils/activate-user-helper");
}

createRoot(document.getElementById("root")!).render(<App />);
