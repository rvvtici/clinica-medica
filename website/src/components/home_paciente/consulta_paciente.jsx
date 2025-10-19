import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./consulta_paciente.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser } from "react-icons/fa";

const ConsultaPaciente = () => {
//   const [email, setEmail] = useState("");

  return (
    <>
      <Header />
      <div id="page">        
        <h1>Consulta Paciente</h1>
      </div>
      <Footer />
    </>
  );
};

export default ConsultaPaciente;
