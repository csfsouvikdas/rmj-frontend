
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { registerSW } from 'virtual:pwa-register';

  // This automatically checks for updates every time the app is opened
  registerSW({ immediate: true });

  createRoot(document.getElementById("root")!).render(<App />);
  