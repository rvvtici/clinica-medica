import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./convenios.css";
import HeaderPaciente from "../header/header_paciente.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser } from "react-icons/fa";

const Convenio = () => {
//   const [email, setEmail] = useState("");

  const convenios = [
    { id: "unimed", nome: "Unimed" },
    { id: "amil", nome: "Amil" },
    { id: "sulamerica", nome: "SulAmérica" },
    { id: "bradesco", nome: "Bradesco Saúde" },
    { id: "porto", nome: "Porto Seguro Saúde" }
  ];


  return (
    <>
      <HeaderPaciente />
      <div class="page-convenios">        
        <p className="title">
          Convênios
        </p>

        <p className="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
          in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          A busca pode ser realizada selecionando o convênio e especialidade ou a 
          partir do nome do profissional.
        </p>
    
      <ul className="lista-convenios">
        {convenios.map((conv) => (
          <li key={conv.id}>{conv.nome}</li>
        ))}
      </ul>
    
    
      </div>
    </>
  );
};

export default Convenio;
