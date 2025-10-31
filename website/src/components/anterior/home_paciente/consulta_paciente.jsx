import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./consulta_paciente.css";
import HeaderPaciente from "../header/header_paciente.jsx";
import Footer from "../footer/footer.jsx";

const ConsultaPaciente = () => {
  const [tipoConsulta, setTipoConsulta] = useState("");
  const [convenio, setConvenio] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [medico, setMedico] = useState("");
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const convenios = {
    Unimed: ["Cardiologia", "Dermatologia", "Ortopedia"],
    Amil: ["Ginecologia", "Pediatria", "Endocrinologia"],
    "SulAmérica": ["Neurologia", "Psiquiatria", "Oftalmologia"],
  };

  const medicos = {
    "Cardiologia": ["Dr. Carlos Silva", "Dra. Ana Santos"],
    "Dermatologia": ["Dr. Pedro Costa", "Dra. Mariana Lima"],
    "Ortopedia": ["Dr. Roberto Alves"],
    "Ginecologia": ["Dra. Juliana Ferreira"],
    "Pediatria": ["Dra. Patricia Oliveira"],
    "Endocrinologia": ["Dr. Marcelo Dias"],
    "Neurologia": ["Dr. Ricardo Nunes"],
    "Psiquiatria": ["Dra. Camila Rocha"],
    "Oftalmologia": ["Dr. Fernando Souza"]
  };

  const horarios = {
    "Dr. Carlos Silva": ["08:00", "09:00", "10:00", "14:00", "15:00"],
    "Dra. Ana Santos": ["08:30", "09:30", "10:30", "14:30", "15:30"],
    "Dr. Pedro Costa": ["09:00", "10:00", "11:00", "16:00", "17:00"],
    "Dra. Mariana Lima": ["08:00", "10:00", "13:00", "14:00", "15:00"],
    "Dr. Roberto Alves": ["07:00", "08:00", "09:00", "13:00", "14:00"],
    "Dra. Juliana Ferreira": ["08:00", "09:00", "10:00", "11:00", "14:00"],
    "Dra. Patricia Oliveira": ["08:30", "10:30", "13:30", "14:30", "15:30"],
    "Dr. Marcelo Dias": ["09:00", "10:00", "11:00", "14:00", "16:00"],
    "Dr. Ricardo Nunes": ["08:00", "10:00", "11:00", "14:00", "15:00"],
    "Dra. Camila Rocha": ["09:30", "10:30", "11:30", "14:30", "16:30"],
    "Dr. Fernando Souza": ["08:00", "09:00", "10:00", "13:00", "15:00"]
  };

  const locais = {
    "Dr. Carlos Silva": "Hospital Central - Sala 201",
    "Dra. Ana Santos": "Clínica Saúde Total - Sala 105",
    "Dr. Pedro Costa": "Hospital das Clínicas - Ala B, Sala 304",
    "Dra. Mariana Lima": "Clínica Dermatológica - Sala 102",
    "Dr. Roberto Alves": "Hospital Ortopédico - Sala 401",
    "Dra. Juliana Ferreira": "Clínica da Mulher - Sala 203",
    "Dra. Patricia Oliveira": "Hospital Infantil - Ala C, Sala 108",
    "Dr. Marcelo Dias": "Centro de Endocrinologia - Sala 301",
    "Dr. Ricardo Nunes": "Instituto Neurológico - Sala 205",
    "Dra. Camila Rocha": "Clínica Psiquiátrica - Sala 101",
    "Dr. Fernando Souza": "Hospital de Olhos - Sala 302"
  };

  const handleConvenioChange = (e) => {
    setConvenio(e.target.value);
    setEspecialidade("");
    setMedico("");
    setHorario("");
    setLocal("");
  };

  const handleEspecialidadeChange = (e) => {
    setEspecialidade(e.target.value);
    setMedico("");
    setHorario("");
    setLocal("");
  };

  const handleMedicoChange = (e) => {
    setMedico(e.target.value);
    setHorario("");
    setLocal(e.target.value ? locais[e.target.value] : "");
  };

  const handleTipoConsultaChange = (e) => {
    setTipoConsulta(e.target.value);
  };

  return (
    <>
      <HeaderPaciente />
      <div className="page-consulta-paciente">
        <p className="title">
            Agendar consulta
          </p>

          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque dolor sapien. Aenean volutpat est felis, non pellentesque ligula volutpat et. Nam elementum nunc at tempus vulputate. Aliquam sed quam sit amet nunc laoreet auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque quis purus tincidunt, luctus libero non, commodo elit. Nullam turpis libero, sodales nec malesuada sed, ultricies id sem. Vivamus non imperdiet est. Vestibulum tempor nisi eget tincidunt venenatis. Curabitur vestibulum justo odio, in suscipit libero malesuada sed.
          </p>
          <p className="content">
            Vestibulum finibus dui nec arcu porta, vitae sodales nisi feugiat. Sed tristique dignissim interdum. Integer elementum tempus tortor, id ullamcorper velit auctor eget. Aenean urna nunc, cursus sed malesuada ac, ullamcorper nec est. Suspendisse finibus, erat id pellentesque vulputate, augue nunc fermentum lectus, ac scelerisque magna lacus in ante. Mauris tempor neque orci, sed porttitor lacus luctus vel. Suspendisse vel mauris ipsum. Etiam vulputate consequat nibh ut sollicitudin.
          </p>

          <div className="container-consulta">
            {/* Tipo de Consulta */}
            <div className="input-field">
              <label>Tipo de Consulta:</label>
              <select
                value={tipoConsulta}
                onChange={handleTipoConsultaChange}
                className="select-field"
              >
                <option value="">Selecione o tipo</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>

            {/* Convênio */}
            <div className="input-field">
              <label>Convênio:</label>
              <select
                value={convenio}
                onChange={handleConvenioChange}
                className="select-field"
              >
                <option value="">Selecione um convênio</option>
                {Object.keys(convenios).map((conv) => (
                  <option key={conv} value={conv}>
                    {conv}
                  </option>
                ))}
              </select>
            </div>

            {/* Especialidade */}
            <div className="input-field">
              <label>Especialidade:</label>
              <select
                value={especialidade}
                onChange={handleEspecialidadeChange}
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
            </div>

            {/* Médico */}
            <div className="input-field">
              <label>Médico:</label>
              <select
                value={medico}
                onChange={handleMedicoChange}
                className="select-field"
                disabled={!especialidade}
              >
                <option value="">
                  {especialidade
                    ? "Selecione um médico"
                    : "Escolha uma especialidade primeiro"}
                </option>
                {especialidade &&
                  medicos[especialidade]?.map((med) => (
                    <option key={med} value={med}>
                      {med}
                    </option>
                  ))}
              </select>
            </div>

            {/* Horário */}
            <div className="input-field">
              <label>Horário:</label>
              <select
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="select-field"
                disabled={!medico}
              >
                <option value="">
                  {medico
                    ? "Selecione um horário"
                    : "Escolha um médico primeiro"}
                </option>
                {medico &&
                  horarios[medico]?.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
              </select>
            </div>

            {/* Local (apenas para consulta presencial) */}
            {tipoConsulta === "presencial" && medico && (
              <div className="input-field">
                <label>Local:</label>
                <input
                  type="text"
                  value={local}
                  className="input-field-text"
                  readOnly
                  placeholder="Local da consulta"
                />
                <small>Local definido automaticamente pelo médico escolhido</small>
              </div>
            )}

            {/* Observações */}
            <div className="input-field">
              <label>Observações:</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="textarea-field"
                placeholder="Digite aqui qualquer observação adicional..."
                rows="4"
              />
            </div>
            {/* Resumo e Botão de Agendar */}
            {(tipoConsulta && convenio && especialidade && medico && horario) && (
              <>
                <div className="resumo-consulta">
                  <h3>Resumo da Consulta</h3>
                  <div className="resumo-content">
                    <p><strong>Tipo:</strong> {tipoConsulta === 'online' ? 'Online' : 'Presencial'}</p>
                    <p><strong>Convênio:</strong> {convenio}</p>
                    <p><strong>Especialidade:</strong> {especialidade}</p>
                    <p><strong>Médico:</strong> {medico}</p>
                    <p><strong>Horário:</strong> {horario}</p>
                    {tipoConsulta === 'presencial' && <p><strong>Local:</strong> {local}</p>}
                    {observacoes && <p><strong>Observações:</strong> {observacoes}</p>}
                  </div>
                </div>
                <button className="btn-agendar">
                  Confirmar Agendamento
                </button>
              </>
            )}
          </div>
      </div>
    </>
  );
};

export default ConsultaPaciente;