import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import { useState } from "react";
// import "./App.css";
import Cadastro from "./components/cadastro/cadastro.jsx";
import Login from "./components/login/Login.jsx"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;