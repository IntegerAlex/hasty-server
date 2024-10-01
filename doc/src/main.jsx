import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./layout.jsx";
import Introduction from "./components/introducation.jsx";
import Features from "./components/features.jsx";
import Installation from "./components/installation.jsx";
import QuickStart from "./components/quick-start.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/features" element={<Features />} />
          <Route path="/installation" element={<Installation />} />
          <Route path="/quickstart" element={<QuickStart />} />
        </Routes>
      </Layout>
    </Router>
  </StrictMode>
);
