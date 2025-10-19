import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./online_paciente.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser } from "react-icons/fa";

const OnlinePaciente = () => {
//   const [email, setEmail] = useState("");

  return (
    <>
      <Header />
      <div id="page">        
        <h1>Online Paciente</h1>
      </div>
      <Footer />
    </>
  );
};

export default OnlinePaciente;
