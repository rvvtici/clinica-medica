import React from "react";
import "./header_paciente.css";
import { Link } from "react-router-dom";

const HeaderPaciente = () => {
  return (
    <header id="header_paciente">
      <div>
        <p>
          Clínica Médica
        </p>
      </div>
  
    <div>
      <nav className="nav_links">
        <Link className="nav_link" to="/home_paciente">Home</Link>
        <Link className="nav_link" to="/especialidades">Especialidades</Link>
        <Link className="nav_link" to="/convenios">Convênios</Link>
        <Link className="perfil" to="/perfil">Perfil</Link>
      </nav>
        
    </div>
    </header>
  );
};

export default HeaderPaciente;
