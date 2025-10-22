import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./perfil_paciente.css";
import HeaderPaciente from "../header/header_paciente.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser } from "react-icons/fa";

const PerfilPaciente = () => {

  return (
    <>
      <HeaderPaciente />
      <div id="page">        
        <h1>Perfil Paciente</h1>

      </div>
      <Footer />
    </>
  );
};

export default PerfilPaciente;
