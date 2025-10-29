import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home_medico.css";
import HeaderMedico from "./header_medico.jsx";
import Footer from "../footer/footer.jsx";
import { FaCalendar, FaUser, FaVideo, FaClock, FaSearch, FaStethoscope } from "react-icons/fa";

const HomeMedico = () => {
  const [visualizacaoAgenda, setVisualizacaoAgenda] = useState("dia");
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  // Dados mockados da agenda
  const agendaDia = [
    { hora: "09:00", paciente: "Maria Santos", tipo: "presencial", status: "realizada", duracao: "30min" },
    { hora: "10:30", paciente: "Pedro Costa", tipo: "presencial", status: "realizada", duracao: "30min" },
    { hora: "14:00", paciente: "João Silva", tipo: "online", status: "agendada", duracao: "45min" },
    { hora: "15:30", paciente: "Ana Oliveira", tipo: "presencial", status: "agendada", duracao: "30min" },
    { hora: "17:00", paciente: "Carlos Mendes", tipo: "online", status: "agendada", duracao: "30min" }
  ];

  const agendaSemana = [
    { data: "2024-01-22", dia: "Seg", consultas: 8 },
    { data: "2024-01-23", dia: "Ter", consultas: 6 },
    { data: "2024-01-24", dia: "Qua", consultas: 7 },
    { data: "2024-01-25", dia: "Qui", consultas: 5 },
    { data: "2024-01-26", dia: "Sex", consultas: 4 }
  ];

  const agendaMes = [
    { semana: "1ª Semana", consultas: 32 },
    { semana: "2ª Semana", consultas: 28 },
    { semana: "3ª Semana", consultas: 35 },
    { semana: "4ª Semana", consultas: 30 }
  ];

  const proximaConsulta = {
    id: "consulta_001",
    pacienteNome: "João Silva Santos",
    pacienteIdade: "38 anos",
    tipo: "online",
    data: "2024-01-20",
    hora: "14:00",
    especialidade: "Cardiologia",
    link: "https://meet.google.com/abc-def-ghi",
    status: "agendada",
    duracao: "45min"
  };

  const handleDiaClick = (dia) => {
    setDiaSelecionado(diaSelecionado?.data === dia.data ? null : dia);
  };

  const renderAgenda = () => {
    switch (visualizacaoAgenda) {
      case "dia":
        return (
          <div className="agenda-list">
            {agendaDia.map((consulta, index) => (
              <div key={index} className={`agenda-item ${consulta.status}`}>
                <div className="agenda-hora">
                  <strong>{consulta.hora}</strong>
                  <span className="duracao">{consulta.duracao}</span>
                </div>
                <div className="agenda-paciente">
                  <span className="nome">{consulta.paciente}</span>
                  <span className={`tipo ${consulta.tipo}`}>
                    {consulta.tipo === 'online' ? <FaVideo /> : <FaStethoscope />}
                    {consulta.tipo}
                  </span>
                </div>
                <div className="agenda-status">
                  <span className={`status ${consulta.status}`}>
                    {consulta.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      
      case "semana":
        return (
          <div className="agenda-semana">
            {agendaSemana.map((dia, index) => (
              <div 
                key={index} 
                className={`semana-item ${diaSelecionado?.data === dia.data ? 'selecionado' : ''}`}
                onClick={() => handleDiaClick(dia)}
              >
                <div className="dia-info">
                  <strong>{dia.dia}</strong>
                  <span className="data">{dia.data}</span>
                </div>
                <div className="consultas-count">
                  <span>{dia.consultas} consultas</span>
                </div>
              </div>
            ))}
          </div>
        );
      
      case "mes":
        return (
          <div className="agenda-mes">
            {agendaMes.map((semana, index) => (
              <div key={index} className="mes-item">
                <div className="semana-info">
                  <strong>{semana.semana}</strong>
                </div>
                <div className="consultas-count">
                  <span>{semana.consultas} consultas</span>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderDetalhesDia = () => {
    if (!diaSelecionado) return null;

    return (
      <div className="detalhes-dia">
        <h4>Detalhes do Dia {diaSelecionado.data}</h4>
        <div className="detalhes-content">
          <p><strong>Total de consultas:</strong> {diaSelecionado.consultas}</p>
          <p><strong>Horário de trabalho:</strong> 08:00 - 18:00</p>
          <p><strong>Disponibilidade:</strong> {diaSelecionado.consultas < 10 ? "Com vagas" : "Lotado"}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <HeaderMedico />
      <div className="page-home-medico">

        <p className="title">
          Área do Médico
        </p>

        <div className="user">
          <p>Boas-vindas, Dr. Carlos Silva!</p>
        </div>

        {/* Agenda */}
        <div className="container-agenda">
          <div className="agenda-header">
            <h3 className="title-agenda">
              <FaCalendar /> Minha Agenda
            </h3>
            <div className="filtros-agenda">
              <button 
                className={`filtro-btn ${visualizacaoAgenda === 'dia' ? 'active' : ''}`}
                onClick={() => setVisualizacaoAgenda('dia')}
              >
                Dia
              </button>
              <button 
                className={`filtro-btn ${visualizacaoAgenda === 'semana' ? 'active' : ''}`}
                onClick={() => setVisualizacaoAgenda('semana')}
              >
                Semana
              </button>
              <button 
                className={`filtro-btn ${visualizacaoAgenda === 'mes' ? 'active' : ''}`}
                onClick={() => setVisualizacaoAgenda('mes')}
              >
                Mês
              </button>
            </div>
          </div>

          {renderAgenda()}
          {renderDetalhesDia()}
        </div>

        {/* Próxima Consulta */}
        <div className="container-item">
          <h3 className="title-item">
            <FaClock /> Próxima Consulta
          </h3>
          <div className="proxima-consulta">
            <div className="consulta-info">
              <div className="paciente-detalhes">
                <strong>{proximaConsulta.pacienteNome}</strong>
                <span>{proximaConsulta.pacienteIdade}</span>
                <span className={`tipo ${proximaConsulta.tipo}`}>
                  {proximaConsulta.tipo === 'online' ? <FaVideo /> : <FaStethoscope />}
                  {proximaConsulta.tipo}
                </span>
              </div>
              <div className="consulta-horario">
                <p><strong>Data:</strong> {proximaConsulta.data}</p>
                <p><strong>Hora:</strong> {proximaConsulta.hora}</p>
                <p><strong>Duração:</strong> {proximaConsulta.duracao}</p>
                <p><strong>Status:</strong> <span className={`status ${proximaConsulta.status}`}>{proximaConsulta.status}</span></p>
              </div>
            </div>
            {proximaConsulta.tipo === 'online' && proximaConsulta.status === 'agendada' && (
              <a 
                href={proximaConsulta.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-consulta-online"
              >
                <FaVideo /> Entrar na Consulta Online
              </a>
            )}
          </div>
        </div>

        {/* Buscar Paciente */}
        <div className="container-item">
          <h3 className="title-item">
            <FaSearch /> Buscar Paciente
          </h3>
          <p className="subtitle-item">
            Acesse prontuários completos dos pacientes através do CPF.
          </p>
          <button className="button-item">
            <Link className="link" to="/home_medico/buscar-paciente">Buscar por CPF</Link>
          </button>
        </div>

        {/* Consultas Online */}
        <div className="container-item">
          <h3 className="title-item">
            <FaVideo /> Consultas Online
          </h3>
          <p className="subtitle-item">
            Gerencie suas consultas remotas e acesse a plataforma de atendimento online.
          </p>
          <button className="button-item">
            <Link className="link" to="/home_medico/online">Acessar Plataforma Online</Link>
          </button>
        </div>

        {/* Meu Perfil */}
        <div className="container-item">
          <h3 className="title-item">
            <FaUser /> Meu Perfil
          </h3>
          <p className="subtitle-item">
            Gerencie seus dados profissionais, horários de atendimento e especialidades.
          </p>
          <button className="button-item">
            <Link className="link" to="/home_medico/perfil">Acessar Meu Perfil</Link>
          </button>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default HomeMedico;