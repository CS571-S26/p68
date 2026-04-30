import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RecommendPage from "./pages/RecommendPage";
import ShopPage from "./pages/ShopPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <BrowserRouter basename="/p68">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage setAnalysisResult={setAnalysisResult} />} />
        <Route path="/recommend" element={<RecommendPage analysisResult={analysisResult} />} />
        <Route path="/shop" element={<ShopPage analysisResult={analysisResult} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}////