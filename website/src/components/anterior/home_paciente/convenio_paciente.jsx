import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./convenio_paciente.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser } from "react-icons/fa";

const ConvenioPaciente = () => {
//   const [email, setEmail] = useState("");

  return (
    <>
      <Header />
      <div id="page">        
        <h1>Convenio Paciente</h1>
      </div>
      <Footer />
    </>
  );
};

export default ConvenioPaciente;
