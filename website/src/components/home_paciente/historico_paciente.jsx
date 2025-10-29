import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./historico_paciente.css";
import HeaderPaciente from "../header/header_paciente.jsx";
import Footer from "../footer/footer.jsx";
import { FaChevronDown, FaChevronUp, FaStethoscope, FaFileMedical, FaMoneyBillWave, FaLink, FaUserMd } from "react-icons/fa";

const HistoricoPaciente = () => {
  const [consultas, setConsultas] = useState([
    {
      id: 1,
      data: "2024-01-20",
      hora: "14:00",
      medico: "Dr. Carlos Silva",
      especialidade: "Cardiologia",
      tipo: "online",
      status: "realizada",
      link: "https://meet.google.com/abc-def-ghi",
      expandida: false,
      diagnostico: "Hipertensão arterial controlada",
      observacoes: "Paciente relata aderência ao tratamento",
      exames: [
        { nome: "Hemograma completo", status: "realizado" },
        { nome: "Eletrocardiograma", status: "solicitado" }
      ],
      receitas: [
        { medicamento: "Losartana 50mg", posologia: "1 comprimido ao dia" }
      ],
      pagamento: {
        status: "pago",
        tipo: "convenio",
        valor: 200.00,
        convenio: "Unimed"
      }
    },
    {
      id: 2,
      data: "2024-01-25",
      hora: "10:00", 
      medico: "Dra. Ana Santos",
      especialidade: "Dermatologia",
      tipo: "presencial",
      status: "agendada",
      link: "https://meet.google.com/xyz-uvw-rst",
      expandida: false,
      diagnostico: "",
      observacoes: "",
      exames: [],
      receitas: [],
      pagamento: {
        status: "pendente",
        tipo: "particular", 
        valor: 150.00
      }
    }
  ]);

  const toggleExpandida = (id) => {
    setConsultas(prev => prev.map(consulta => 
      consulta.id === id 
        ? { ...consulta, expandida: !consulta.expandida }
        : consulta
    ));
  };

  return (
    <>
      <HeaderPaciente />
      <div className="page-perfil">
        <div className="page-header">
          <p className="title">Histórico de Consultas</p>
          <Link to="/home_paciente/perfil" className="btn-voltar">
            Voltar ao Perfil
          </Link>
        </div>

        <div className="consultas-list">
          {consultas.map(consulta => (
            <div key={consulta.id} className={`consulta-item ${consulta.status}`}>
              <div 
                className="consulta-header"
                onClick={() => toggleExpandida(consulta.id)}
              >
                <div className="consulta-info">
                  <div className="consulta-data">
                    <strong>{consulta.data}</strong> às {consulta.hora}
                  </div>
                  <div className="consulta-medico">
                    <FaUserMd /> {consulta.medico} - {consulta.especialidade}
                  </div>
                  <div className="consulta-tipo">
                    <span className={`badge ${consulta.tipo}`}>
                      {consulta.tipo === 'online' ? <FaLink /> : <FaStethoscope />}
                      {consulta.tipo}
                    </span>
                    <span className={`status ${consulta.status}`}>
                      {consulta.status}
                    </span>
                  </div>
                </div>
                
                <div className="consulta-actions">
                  {consulta.tipo === 'online' && consulta.status === 'agendada' && (
                    <a 
                      href={consulta.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLink /> Entrar na Consulta
                    </a>
                  )}
                  <button className="btn-expandir">
                    {consulta.expandida ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {consulta.expandida && (
                <div className="consulta-detalhes">
                  {/* Diagnóstico */}
                  {consulta.diagnostico && (
                    <div className="detalhe-section">
                      <h4>Diagnóstico</h4>
                      <p>{consulta.diagnostico}</p>
                    </div>
                  )}

                  {/* Observações */}
                  {consulta.observacoes && (
                    <div className="detalhe-section">
                      <h4>Observações</h4>
                      <p>{consulta.observacoes}</p>
                    </div>
                  )}

                  {/* Exames */}
                  <div className="detalhe-section">
                    <h4>
                      <FaFileMedical /> Exames
                    </h4>
                    {consulta.exames.length > 0 ? (
                      <ul className="exames-list">
                        {consulta.exames.map((exame, idx) => (
                          <li key={idx} className={exame.status}>
                            {exame.nome} - <span>{exame.status}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Nenhum exame solicitado</p>
                    )}
                  </div>

                  {/* Receitas */}
                  <div className="detalhe-section">
                    <h4>Receitas</h4>
                    {consulta.receitas.length > 0 ? (
                      <ul className="receitas-list">
                        {consulta.receitas.map((receita, idx) => (
                          <li key={idx}>
                            <strong>{receita.medicamento}</strong> - {receita.posologia}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Nenhuma receita prescrita</p>
                    )}
                  </div>

                  {/* Pagamento */}
                  <div className="detalhe-section">
                    <h4>
                      <FaMoneyBillWave /> Pagamento
                    </h4>
                    <div className={`pagamento-info ${consulta.pagamento.status}`}>
                      <p><strong>Status:</strong> {consulta.pagamento.status}</p>
                      <p><strong>Tipo:</strong> {consulta.pagamento.tipo}</p>
                      <p><strong>Valor:</strong> R$ {consulta.pagamento.valor}</p>
                      {consulta.pagamento.convenio && (
                        <p><strong>Convênio:</strong> {consulta.pagamento.convenio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {consultas.length === 0 && (
          <div className="sem-consultas">
            <p>Nenhuma consulta encontrada</p>
            <Link to="/especialidades" className="btn-agendar">
              Agendar Primeira Consulta
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default HistoricoPaciente;