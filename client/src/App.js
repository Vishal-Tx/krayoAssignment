import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Upload from "./Components/Upload/Upload";

const App = () => {
  return (
    <Router>
      <div className="w-screen h-screen ">
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/upload" exact element={<Upload />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
