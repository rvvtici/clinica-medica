import React from "react";
import "./header_medico.css";
import { Link } from "react-router-dom";

const HeaderMedico = () => {
  return (
    <header id="header_medico">
      <div>
        <p>
          Clínica Médica
        </p>
      </div>

    <div>
      <nav className="nav_links">
        <Link className="nav_link" to="/home_medico">Home</Link>
        <Link className="nav_link" to="/home_medico/consulta">Consulta</Link>
        <Link className="nav_link" to="/home_medico/online">Online</Link>
        <Link className="perfil" to="/home_medico/perfil">Perfil</Link>
      </nav>
    </div>
  
    </header>
  );
};

export default HeaderMedico;
