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
import PerfilMedico from "./components/home_medico/perfil_medico.jsx";


import ConvenioPaciente from "./components/home_paciente/convenio_paciente.jsx";
import PerfilPaciente from "./components/home_paciente/perfil_paciente.jsx";
import HistoricoPaciente from "./components/home_paciente/historico_paciente.jsx";
import ConsultaPaciente from "./components/home_paciente/consulta_paciente.jsx";
import OnlinePaciente from "./components/home_paciente/online_paciente.jsx";
import EditarPerfil from "./components/home_paciente/editar_perfil.jsx";

import Convenios from "./components/convenios/convenios.jsx";
import Especialidades from "./components/especialidades/especialidades.jsx";




function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/convenios" element={<Convenios />} />
          <Route path="/especialidades" element={<Especialidades />} />

          <Route path="/home_paciente" element={<HomePaciente />} />
          <Route path="/home_paciente/consulta" element={<ConsultaPaciente />} />

          <Route path="/home_paciente/perfil" element={<PerfilPaciente />} />
          <Route path="/home_paciente/perfil/editar" element={<EditarPerfil />} />
          <Route path="/home_paciente/perfil/historico" element={<HistoricoPaciente />} />
          <Route path="/home_paciente/online" element={<OnlinePaciente />} />

          <Route path="/home_funcionario" element={<HomeFuncionario />} />

          <Route path="/home_medico" element={<HomeMedico />} />
          <Route path="/home_medico/online" element={<OnlineMedico />} />
          <Route path="/home_medico/consulta" element={<ConsultaMedico />} />
          <Route path="/home_medico/perfil" element={<PerfilMedico />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
