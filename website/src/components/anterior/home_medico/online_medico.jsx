import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./online_medico.css";
import HeaderMedico from "./header_medico.jsx";
import Footer from "../footer/footer.jsx";
import { FaVideo, FaClock, FaUser, FaExternalLinkAlt, FaCalendar, FaInfoCircle, FaHistory, FaFileMedical, FaPrescription, FaNotesMedical } from "react-icons/fa";

const OnlineMedico = () => {
  const [mostrarAtestado, setMostrarAtestado] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [dadosAtestado, setDadosAtestado] = useState({
    dias: "",
    diagnostico: "",
    observacoes: ""
  });

  // Dados mockados
  const [proximaConsulta, setProximaConsulta] = useState({
    id: "consulta_online_001",
    paciente: {
      nome: "Maria Santos Oliveira",
      cpf: "987.654.321-00",
      dataNascimento: "15/03/1986",
      telefone: "(11) 98888-7777",
      email: "maria.oliveira@email.com"
    },
    data: "25/01/2024",
    hora: "16:00",
    tipo: "Retorno",
    queixas: "Dor torácica intermitente, falta de ar aos esforços, palpitações ocasionais",
    medicamentos: "AAS 100mg (uma vez ao dia), Losartana 50mg (uma vez ao dia), Sinvastatina 20mg (uma vez ao dia)",
    observacoes: "Paciente com histórico de hipertensão arterial há 5 anos, diabetes tipo 2 controlada, alergia a dipirona. Realizou ecocardiograma há 3 meses com resultado dentro dos limites da normalidade.",
    status: "agendada",
    duracao: "45min",
    especialidade: "Cardiologia"
  });

  const [consultasHoje, setConsultasHoje] = useState([
    {
      id: "consulta_online_002",
      paciente: "João Silva Santos",
      cpf: "123.456.789-00",
      dataNascimento: "20/08/1975",
      hora: "10:30",
      tipo: "Consulta de rotina",
      queixas: "Check-up anual, sem queixas específicas",
      medicamentos: "Nenhum medicamento de uso contínuo",
      observacoes: "Paciente saudável, sem comorbidades conhecidas. Ex-fumante há 10 anos.",
      status: "realizada"
    },
    {
      id: "consulta_online_003", 
      paciente: "Ana Costa Pereira",
      cpf: "234.567.890-11",
      dataNascimento: "12/11/1990",
      hora: "14:00",
      tipo: "Primeira consulta",
      queixas: "Cefaleia frequente, tonturas, visão turva ocasional",
      medicamentos: "Anticoncepcional oral",
      observacoes: "Histórico familiar de hipertensão. Mede pressão arterial em casa com valores entre 130-140x80-90 mmHg.",
      status: "agendada"
    }
  ]);

  const handleGerarAtestado = () => {
    // Lógica para gerar atestado
    console.log("Gerando atestado:", dadosAtestado);
    alert("Atestado gerado com sucesso!");
    setMostrarAtestado(false);
    setDadosAtestado({ dias: "", diagnostico: "", observacoes: "" });
  };

  const handleAdicionarObservacao = () => {
    // Lógica para adicionar observação
    console.log("Observação adicionada:", observacao);
    alert("Observação adicionada com sucesso!");
    setObservacao("");
  };



  return (
    <>
      <HeaderMedico />
      <div className="page-consulta-medico">
        
        <p className="title">
          Consultas Online
        </p>

        <p className="content">
          As consultas online são realizadas através de plataformas externas de videochamada. Abaixo você encontrará os links para suas consultas agendadas. Certifique-se de ter uma conexão estável com a internet e um ambiente adequado para o atendimento.
        </p>

        {/* Próxima Consulta Online */}
        <div className="container-consulta destaque">
          <h3 className="section-title">
            <FaClock /> Próxima Consulta Online do Dia
          </h3>
          
          <div className="paciente-info">
            <div className="paciente-header">
              <div className="paciente-dados">
                <h4>{proximaConsulta.paciente.nome}</h4>
                <p><strong>CPF:</strong> {proximaConsulta.paciente.cpf}</p>
                <p><strong>Data de Nascimento:</strong> {proximaConsulta.paciente.dataNascimento}</p>
                <p><strong>Telefone:</strong> {proximaConsulta.paciente.telefone}</p>
                <p><strong>Email:</strong> {proximaConsulta.paciente.email}</p>
                <p><strong>Especialidade:</strong> {proximaConsulta.especialidade}</p>
                <p><strong>Tipo de Consulta:</strong> {proximaConsulta.tipo}</p>
              </div>
              <div className="consulta-horario">
                <p>
                  <FaCalendar />
                  <strong>{proximaConsulta.data}</strong>
                </p>
                <p>às {proximaConsulta.hora}</p>
                <span className="duracao">{proximaConsulta.duracao}</span>
              </div>
            </div>

            <div className="detalhes-consulta">
              <div className="info-section">
                <h5>Queixas e Sintomas:</h5>
                <p>{proximaConsulta.queixas}</p>
              </div>
              
              <div className="info-section">
                <h5>Medicamentos em Uso:</h5>
                <p>{proximaConsulta.medicamentos}</p>
              </div>
              
              <div className="observacoes-paciente">
                <h5>Observações e Histórico:</h5>
                <p>{proximaConsulta.observacoes}</p>
              </div>
            </div>

            <div className="acoes-consulta">
              <button className="btn-acao">
                <FaHistory /> Histórico de Consultas
              </button>
              <button className="btn-acao">
                <FaFileMedical /> Resultados de Exames
              </button>
              <button className="btn-acao">
                <FaPrescription /> Receita Médica
              </button>
              <button 
                className="btn-acao"
                onClick={() => setMostrarAtestado(!mostrarAtestado)}
              >
                <FaNotesMedical /> Atestado Médico
              </button>
            </div>

            {mostrarAtestado && (
              <div className="form-atestado">
                <h5>Gerar Atestado Médico</h5>
                <div className="input-field">
                  <label>Dias de Afastamento:</label>
                  <input
                    type="number"
                    value={dadosAtestado.dias}
                    onChange={(e) => setDadosAtestado(prev => ({ ...prev, dias: e.target.value }))}
                    placeholder="Número de dias"
                  />
                </div>
                <div className="input-field">
                  <label>Diagnóstico:</label>
                  <input
                    type="text"
                    value={dadosAtestado.diagnostico}
                    onChange={(e) => setDadosAtestado(prev => ({ ...prev, diagnostico: e.target.value }))}
                    placeholder="Diagnóstico do paciente"
                  />
                </div>
                <div className="input-field">
                  <label>Observações (opcional):</label>
                  <textarea
                    value={dadosAtestado.observacoes}
                    onChange={(e) => setDadosAtestado(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Observações adicionais"
                    rows="3"
                  />
                </div>
                <button className="btn-gerar-atestado" onClick={handleGerarAtestado}>
                  Gerar Atestado
                </button>
              </div>
            )}

            <div className="adicionar-observacoes">
              <h5>Adicionar Observações:</h5>
              <div className="input-observacao">
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Digite suas observações sobre a consulta..."
                  rows="3"
                />
                <button className="btn-enviar" onClick={handleAdicionarObservacao}>
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Consultas Online de Hoje */}
        <div className="container-consulta">
          <h3 className="section-title">
            <FaCalendar /> Consultas Online de Hoje
          </h3>
          
          <div className="consultas-list">
            {consultasHoje.map(consulta => (
              <div key={consulta.id} className="consulta-item detalhada">
                <div className="consulta-header">
                  <div className="paciente-info-rapida">
                    <h4>{consulta.paciente}</h4>
                    <p><strong>CPF:</strong> {consulta.cpf} • <strong>Nasc.:</strong> {consulta.dataNascimento}</p>
                    <p><strong>Hora:</strong> {consulta.hora} • <strong>Tipo:</strong> {consulta.tipo}</p>
                  </div>
                  <span 
                    className="status" 

                  >
                    {consulta.status}
                  </span>
                </div>
                
                <div className="consulta-detalhes">
                  <div className="info-section">
                    <h5>Queixas:</h5>
                    <p>{consulta.queixas}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Medicamentos:</h5>
                    <p>{consulta.medicamentos}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Observações:</h5>
                    <p>{consulta.observacoes}</p>
                  </div>
                </div>
                
                <div className="consulta-actions">
                  <button className="btn-acao">
                    <FaVideo /> Iniciar Consulta
                  </button>
                </div>
              </div>
            ))}
          </div>

          {consultasHoje.length === 0 && (
            <div className="sem-consultas">
              <p>Nenhuma consulta online agendada para hoje.</p>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </>
  );
};

export default OnlineMedico;