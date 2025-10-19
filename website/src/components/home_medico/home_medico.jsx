import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home_medico.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import HeaderMedico from "./header_medico.jsx";

const HomeMedico = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <Header />
      <HeaderMedico />;
      <div id="page">
        
        <h1>Boas vindas, nome_medico</h1>
        <div id="perfil">
          <Link className="link" to="/"><FaUser></FaUser></Link>
        </div>

        <div id="agenda">
          <h2>Agenda</h2>

        </div>

        <div id="proxima_consulta">
          <h2>Próxima consulta</h2>
        </div>


      </div>
      <Footer />
    </>
  );
};

export default HomeMedico;
