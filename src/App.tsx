import "./App.scss";
import { Routes, Route } from "react-router";
import Home from "./pages/Home.tsx";
// import About from "./pages/About.tsx";
import Sheets from "./pages/Sheets.tsx";
import Netlify from "./pages/Netlify.tsx";
import Firebase from "./pages/Firebase.tsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Google Sheets" element={<Sheets />} />
        <Route path="/Firebase (JSON)" element={<Firebase />} />
        <Route path="/Netlify" element={<Netlify />} />
      </Routes>
    </>
  );
}
