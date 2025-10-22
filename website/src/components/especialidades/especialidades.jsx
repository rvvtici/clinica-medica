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
  const [resultadosBusca, setResultadosBusca] = useState([]);

  const convenios = {
    Unimed: ["Cardiologia", "Dermatologia", "Ortopedia"],
    Amil: ["Ginecologia", "Pediatria", "Endocrinologia"],
    "SulAmérica": ["Neurologia", "Psiquiatria", "Oftalmologia"],
  };

  // Dados de médicos para busca
  const medicos = [
    {
      nome: "Diego Potássio",
      convenio: "Unimed",
      especialidade: "Cardiologia",
      crm: "90.453"
    },
    {
      nome: "Ana Santos",
      convenio: "Unimed", 
      especialidade: "Dermatologia",
      crm: "78.321"
    },
    {
      nome: "Carlos Silva",
      convenio: "Amil",
      especialidade: "Pediatria", 
      crm: "65.987"
    },
    {
      nome: "Mariana Lima",
      convenio: "SulAmérica",
      especialidade: "Neurologia",
      crm: "82.456"
    },
    {
      nome: "Roberto Alves",
      convenio: "Unimed",
      especialidade: "Ortopedia",
      crm: "73.159"
    }
  ];

  const handleConvenio = (e) => {
    setConvenio(e.target.value);
    setEspecialidade("");
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleBuscarMedico = () => {
    if (query.trim() === "") {
      setResultadosBusca([]);
      return;
    }

    const resultados = medicos.filter(medico =>
      medico.nome.toLowerCase().includes(query.toLowerCase())
    );
    
    setResultadosBusca(resultados);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBuscarMedico();
    }
  };

  return (
    <>
      <HeaderPaciente />
      <div className="page-especialidades">

        <p className="title">
          Especialidades médicas
        </p>

        <p className="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque dolor sapien. Aenean volutpat est felis, non pellentesque ligula volutpat et. Nam elementum nunc at tempus vulputate. Aliquam sed quam sit amet nunc laoreet auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque quis purus tincidunt, luctus libero non, commodo elit. Nullam turpis libero, sodales nec malesuada sed, ultricies id sem. Vivamus non imperdiet est. Vestibulum tempor nisi eget tincidunt venenatis. Curabitur vestibulum justo odio, in suscipit libero malesuada sed.
        </p>
        <p className="content">
          Vestibulum finibus dui nec arcu porta, vitae sodales nisi feugiat. Sed tristique dignissim interdum. Integer elementum tempus tortor, id ullamcorper velit auctor eget. Aenean urna nunc, cursus sed malesuada ac, ullamcorper nec est. Suspendisse finibus, erat id pellentesque vulputate, augue nunc fermentum lectus, ac scelerisque magna lacus in ante. Mauris tempor neque orci, sed porttitor lacus luctus vel. Suspendisse vel mauris ipsum. Etiam vulputate consequat nibh ut sollicitudin.
        </p>

        <p className="content">
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
              <option value="">
                {convenio
                  ? "Selecione uma especialidade"
                  : "Escolha um convênio primeiro"}
              </option>
              {convenio &&
                convenios[convenio].map((esp) => (
                  <option key={esp} value={esp}>
                    {esp}
                  </option>
                ))}
            </select>

            {especialidade && (
              <div className="resultados-especialidade">
                <h4>Médicos disponíveis em {especialidade}:</h4>
                {medicos
                  .filter(medico => medico.especialidade === especialidade && medico.convenio === convenio)
                  .map((medico, index) => (
                    <div key={index} className="result">
                      <p><strong>{medico.nome}</strong></p>
                      <p>Convênio: {medico.convenio}</p>
                      <p>Especialidade: {medico.especialidade}</p>
                      <p>CRM: {medico.crm}</p>
                    </div>
                  ))
                }
                {medicos.filter(medico => medico.especialidade === especialidade && medico.convenio === convenio).length === 0 && (
                  <div className="result">
                    <p>Nenhum médico encontrado para {especialidade} no convênio {convenio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="ou">
            <p>ou</p>
          </div>

          <div className="container-busca">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-field">
                <label className="label-busca">Médico:</label>
                <input
                  type="text"
                  placeholder="Digite o nome do médico"
                  value={query}
                  onChange={handleSearch}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button 
                type="button" 
                className="btn-buscar"
                onClick={handleBuscarMedico}
              >
                Buscar
              </button>
            </form>

            {resultadosBusca.length > 0 && (
              <div className="resultados-busca">
                <h4>Resultados da busca:</h4>
                {resultadosBusca.map((medico, index) => (
                  <div key={index} className="result">
                    <p><strong>{medico.nome}</strong></p>
                    <p>Convênio: {medico.convenio}</p>
                    <p>Especialidade: {medico.especialidade}</p>
                    <p>CRM: {medico.crm}</p>
                  </div>
                ))}
              </div>
            )}

            {resultadosBusca.length === 0 && query && (
              <div className="result">
                <p>Nenhum médico encontrado com o nome "{query}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Especialidades;