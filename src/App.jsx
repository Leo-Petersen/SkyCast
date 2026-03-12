import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import SavedLocations from "./pages/SavedLocations";
import About from "./pages/About";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/locations" element={<SavedLocations />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
