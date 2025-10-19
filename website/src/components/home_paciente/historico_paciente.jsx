import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./historico_paciente.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser } from "react-icons/fa";

const HistoricoPaciente = () => {
//   const [email, setEmail] = useState("");

  return (
    <>
      <Header />
      <div id="page">        
        <h1>Historico Paciente</h1>
      </div>
      <Footer />
    </>
  );
};

export default HistoricoPaciente;
