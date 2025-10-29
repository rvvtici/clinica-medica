import React, { useState } from "react";
import "./consulta_medico.css";
import HeaderMedico from "./header_medico.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaClock, FaFileMedical, FaHistory, FaPrescription, FaNotesMedical, FaSearch, FaVideo } from "react-icons/fa";

const ConsultaMedico = () => {
  const [cpfBusca, setCpfBusca] = useState("");
  const [pacienteBuscado, setPacienteBuscado] = useState(null);
  const [observacao, setObservacao] = useState("");
  const [mostrarAtestado, setMostrarAtestado] = useState(false);
  const [dadosAtestado, setDadosAtestado] = useState({
    dias: "",
    diagnostico: "",
    observacoes: ""
  });

  // Dados mockados - substituir por Firebase depois
  const [consultaAtual, setConsultaAtual] = useState({
    id: "consulta_001",
    paciente: {
      nome: "Jonas Ferreira Junior",
      cpf: "123.456.789-00",
      idade: "45 anos",
      telefone: "(11) 99999-8888",
      email: "jonas.ferreira@email.com",
      convenio: "Unimed",
      carteirinha: "UNI123456789"
    },
    hora: "14:20",
    tipo: "presencial",
    observacoes: "Paciente possui diabetes tipo II controlada com medicamentos",
    historico: [
      { data: "2024-01-15", diagnostico: "Hipertensão arterial", medico: "Dr. Carlos Silva" },
      { data: "2023-11-20", diagnostico: "Check-up anual", medico: "Dra. Ana Santos" }
    ],
    exames: [
      { nome: "Hemograma completo", data: "2024-01-10", resultado: "Normal" },
      { nome: "Glicemia em jejum", data: "2024-01-10", resultado: "98 mg/dL" }
    ]
  });

  const [proximaConsulta, setProximaConsulta] = useState({
    id: "consulta_002",
    paciente: {
      nome: "Maria Santos Oliveira",
      cpf: "987.654.321-00", 
      idade: "38 anos",
      telefone: "(11) 98888-7777",
      convenio: "Amil"
    },
    data: "2024-01-25",
    hora: "16:00",
    tipo: "online",
    link: "https://meet.google.com/xyz-uvw-rst"
  });

  const handleBuscarPaciente = () => {
    if (cpfBusca.trim() === "") return;
    
    // Mock da busca - substituir por Firebase
    const pacienteEncontrado = {
      nome: "Carlos Alberto Mendes",
      cpf: cpfBusca,
      idade: "52 anos", 
      telefone: "(11) 97777-6666",
      email: "carlos.mendes@email.com",
      convenio: "SulAmérica",
      historico: [
        { data: "2023-12-10", diagnostico: "Dor lombar", medico: "Dr. Roberto Alves" },
        { data: "2023-09-05", diagnostico: "Consulta rotina", medico: "Dra. Mariana Lima" }
      ],
      exames: [
        { nome: "Raio-X Coluna", data: "2023-12-15", resultado: "Hérnia de disco L4-L5" },
        { nome: "Ressonância Magnética", data: "2023-12-20", resultado: "Confirmado hérnia de disco" }
      ]
    };
    
    setPacienteBuscado(pacienteEncontrado);
  };

  const handleAdicionarObservacao = () => {
    if (observacao.trim() === "") return;
    
    // Adicionar observação à consulta atual
    const novaObservacao = `[${new Date().toLocaleString()}] ${observacao}`;
    setConsultaAtual(prev => ({
      ...prev,
      observacoes: prev.observacoes ? `${prev.observacoes}\n${novaObservacao}` : novaObservacao
    }));
    setObservacao("");
  };

  const handleGerarAtestado = () => {
    if (!dadosAtestado.dias || !dadosAtestado.diagnostico) {
      alert("Preencha os campos obrigatórios do atestado");
      return;
    }
    
    console.log("Atestado gerado:", dadosAtestado);
    alert("Atestado gerado com sucesso!");
    setMostrarAtestado(false);
    setDadosAtestado({ dias: "", diagnostico: "", observacoes: "" });
  };

  return (
    <>
      <HeaderMedico />
      <div className="page-consulta-medico">
        
        <p className="title">
          Consulta Médica
        </p>

        {/* Consulta Atual */}
        <div className="container-consulta">
          <h3 className="section-title">
            <FaUser /> Consulta Atual
          </h3>
          
          <div className="paciente-info">
            <div className="paciente-header">
              <div className="paciente-dados">
                <h4>{consultaAtual.paciente.nome}</h4>
                <p>CPF: {consultaAtual.paciente.cpf} • {consultaAtual.paciente.idade}</p>
                <p>Telefone: {consultaAtual.paciente.telefone} • Email: {consultaAtual.paciente.email}</p>
                <p>Convênio: {consultaAtual.paciente.convenio} • Carteirinha: {consultaAtual.paciente.carteirinha}</p>
              </div>
              <div className="consulta-horario">
                <p><FaClock /> {consultaAtual.hora}</p>
                <span className={`badge ${consultaAtual.tipo}`}>
                  {consultaAtual.tipo}
                </span>
              </div>
            </div>

            {consultaAtual.observacoes && (
              <div className="observacoes-paciente">
                <h5>Observações do Paciente:</h5>
                <p>{consultaAtual.observacoes}</p>
              </div>
            )}

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

        {/* Buscar Paciente por CPF */}
        <div className="container-consulta">
          <h3 className="section-title">
            <FaSearch /> Buscar Paciente por CPF
          </h3>
          
          <div className="busca-paciente">
            <div className="input-busca">
              <input
                type="text"
                placeholder="Digite o CPF do paciente"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value)}
              />
              <button className="btn-buscar" onClick={handleBuscarPaciente}>
                <FaSearch /> Buscar
              </button>
            </div>
          </div>

          {pacienteBuscado && (
            <div className="paciente-encontrado">
              <div className="paciente-header">
                <div className="paciente-dados">
                  <h4>{pacienteBuscado.nome}</h4>
                  <p>CPF: {pacienteBuscado.cpf} • {pacienteBuscado.idade}</p>
                  <p>Telefone: {pacienteBuscado.telefone} • Email: {pacienteBuscado.email}</p>
                  <p>Convênio: {pacienteBuscado.convenio}</p>
                </div>
              </div>

              <div className="acoes-paciente">
                <button className="btn-acao">
                  <FaHistory /> Histórico de Consultas
                </button>
                <button className="btn-acao">
                  <FaFileMedical /> Resultados de Exames
                </button>
              </div>

              <div className="historico-rapido">
                <h5>Últimas Consultas:</h5>
                {pacienteBuscado.historico.map((consulta, index) => (
                  <div key={index} className="consulta-item">
                    <strong>{consulta.data}</strong> - {consulta.diagnostico}
                    <span>Médico: {consulta.medico}</span>
                  </div>
                ))}
              </div>

              <div className="exames-rapido">
                <h5>Exames Recentes:</h5>
                {pacienteBuscado.exames.map((exame, index) => (
                  <div key={index} className="exame-item">
                    <strong>{exame.nome}</strong> - {exame.data}
                    <span>Resultado: {exame.resultado}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Próxima Consulta */}
        <div className="container-consulta">
          <h3 className="section-title">
            <FaClock /> Próxima Consulta
          </h3>
          
          <div className="proxima-consulta">
            <div className="paciente-header">
              <div className="paciente-dados">
                <h4>{proximaConsulta.paciente.nome}</h4>
                <p>CPF: {proximaConsulta.paciente.cpf} • {proximaConsulta.paciente.idade}</p>
                <p>Telefone: {proximaConsulta.paciente.telefone}</p>
                <p>Convênio: {proximaConsulta.paciente.convenio}</p>
              </div>
              <div className="consulta-horario">
                <p><FaClock /> {proximaConsulta.data} às {proximaConsulta.hora}</p>
                <span className={`badge ${proximaConsulta.tipo}`}>
                  {proximaConsulta.tipo === 'online' ? <FaVideo /> : ''}
                  {proximaConsulta.tipo}
                </span>
              </div>
            </div>

            <div className="acoes-paciente">
              <button className="btn-acao">
                <FaHistory /> Histórico de Consultas
              </button>
              <button className="btn-acao">
                <FaFileMedical /> Resultados de Exames
              </button>
            </div>

            {proximaConsulta.tipo === 'online' && (
              <div className="link-consulta-online">
                <a href={proximaConsulta.link} target="_blank" rel="noopener noreferrer" className="btn-online">
                  <FaVideo /> Acessar Consulta Online
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default ConsultaMedico;