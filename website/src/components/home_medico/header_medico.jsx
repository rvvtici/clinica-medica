import React from "react";
import "./header_medico.css";
import { Link } from "react-router-dom";

const HeaderMedico = () => {
  return (
    <header id="header_medico">
      <nav className="nav_links">
        <Link className="link" to="/home_medico">Home</Link>
        <Link className="link" to="/home_medico/consulta">Consulta</Link>
        <Link className="link" to="/home_medico/online">Online</Link>
      </nav>
    </header>
  );
};

export default HeaderMedico;
