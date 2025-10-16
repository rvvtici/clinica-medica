import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import { useState } from "react";
// import "./App.css";
import Cadastro from "./components/cadastro/cadastro.jsx";
import Login from "./components/login/login.jsx";
import HomeMedico from "./components/home_medico/home_medico.jsx";
import HomeFuncionario from "./components/home_funcionario/home_funcionario.jsx";
import HomePaciente from "./components/home_paciente/home_paciente.jsx";
import ConsultaMedico from "./components/home_medico/consulta_medico.jsx";
import OnlineMedico from "./components/home_medico/online_medico.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home_medico" element={<HomeMedico />} />
          <Route path="/home_funcionario" element={<HomeFuncionario />} />
          <Route path="/home_paciente" element={<HomePaciente />} />
          <Route path="/home_medico/online" element={<OnlineMedico />} />
          <Route path="/home_medico/consulta" element={<ConsultaMedico />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
