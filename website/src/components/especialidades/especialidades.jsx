import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./especialidades.css";
import HeaderPaciente from "../header/header_paciente.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser } from "react-icons/fa";

const Especialidades = () => {
  const [query, setQuery] = useState("");
  const [convenio, setConvenio] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  const convenios = {
    Unimed: ["Cardiologia", "Dermatologia", "Ortopedia"],
    Amil: ["Ginecologia", "Pediatria", "Endocrinologia"],
    "SulAmérica": ["Neurologia", "Psiquiatria", "Oftalmologia"],
  };

  const handleConvenio = (e) => {
    setConvenio(e.target.value);
    setEspecialidade("");
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <HeaderPaciente />
      <div className="page-especialidades">
        <p className="title">
          Especialidades médicas
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

<div className="busca">
<div className="container-busca">
        <label>Convênio:</label>
        <select
          value={convenio}
          onChange={handleConvenio}
          className="select-field"
        >
          {/* mapeia os convenios */}
          <option value="">Selecione um convênio</option>
          {Object.keys(convenios).map((conv) => (
            <option key={conv} value={conv}>
              {conv}
            </option>
          ))}
        </select>


        <label>Especialidade:</label>
        <select
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          className="select-field"
          disabled={!convenio}
        >

          {/* caso convenio nao seja selecionado, desabilita ele e muda para "escolha um convenio antes" */}
          <option value="">
            {convenio
              ? "Selecione uma especialidade"
              : "Escolha um convênio primeiro"}
          </option>

          {/* mapeia as especialidades*/}
          {convenio &&
            convenios[convenio].map((esp) => (
              <option key={esp} value={esp}>
                {esp}
              </option>
            ))}
        </select>

        {especialidade && (
          <p className="result">
            Diego Potássio <br />
            Convênio: {convenio} <br />
            Especialidade: {especialidade} <br />
            CRM: 90.453 <br/>
            {/* <Link */}
            {/* <Link className="nav_link" to="/home_paciente/">Agenda</Link> */}
          </p>
        )}
        </div>

<div className="ou">
    <p>ou</p>
</div>
  


      <div className="container-busca">
        <form>
          <div className="input-field">
            <label className="label-busca">Médico:</label>
            <input
              type="text"
              placeholder="Busca"
              value={query}
              onChange={handleSearch}
            />
          </div>
        </form>
      </div>
</div>
      </div>
    </>
  );
};

export default Especialidades;
