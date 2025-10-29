import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./perfil_paciente.css";
import HeaderPaciente from "../header/header_paciente.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaEdit, FaHistory, FaUsers, FaFileMedical, FaMoneyBillWave, FaStethoscope, FaLink } from "react-icons/fa";

const PerfilPaciente = () => {
  // Dados mockados - substituir por Firebase depois
  const [usuario, setUsuario] = useState({
    cpf: "123.456.789-00",
    nome: "João Silva Santos",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-8888",
    dataNascimento: "1985-05-15",
    sexo: "masculino",
    endereco: {
      cep: "01234-567",
      logradouro: "Rua das Flores, 123",
      bairro: "Jardim Paulista",
      cidade: "São Paulo",
      estado: "SP"
    },
    parentesco: "titular" // titular, conjugue, filho
  });

  const [familia, setFamilia] = useState([
    {
      cpf: "123.456.789-00",
      nome: "João Silva Santos",
      parentesco: "titular",
      convenios: [
        {
          convenio: "Unimed",
          carteirinha: "UNI123456789",
          validade: "2024-12-31",
          plano: "Apartamento"
        }
      ]
    },
    {
      cpf: "987.654.321-00",
      nome: "Maria Silva Santos", 
      parentesco: "conjugue",
      convenios: []
    },
    {
      cpf: "456.789.123-00",
      nome: "Pedro Silva Santos",
      parentesco: "filho",
      convenios: []
    }
  ]);

  const [convenios, setConvenios] = useState([
    {
      convenio: "Unimed",
      carteirinha: "UNI123456789",
      validade: "2024-12-31",
      plano: "Apartamento",
      titular: "João Silva Santos"
    }
  ]);

  const [familiaExpandida, setFamiliaExpandida] = useState(false);

  return (
    <>
      <HeaderPaciente />
      <div className="page-perfil">
        <p className="title">Meu Perfil</p>

        {/* Dados Básicos */}
        <div className="container-perfil">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>Dados Pessoais</h3>
            <Link to="/home_paciente/perfil/editar" className="btn-editar">
              <FaEdit /> Editar
            </Link>
          </div>

          <div className="dados-grid">
            <div className="dado-item">
              <label>Nome Completo:</label>
              <span>{usuario.nome}</span>
            </div>
            <div className="dado-item">
              <label>CPF:</label>
              <span>{usuario.cpf}</span>
            </div>
            <div className="dado-item">
              <label>Email:</label>
              <span>{usuario.email}</span>
            </div>
            <div className="dado-item">
              <label>Telefone:</label>
              <span>{usuario.telefone}</span>
            </div>
            <div className="dado-item">
              <label>Data de Nascimento:</label>
              <span>{usuario.dataNascimento}</span>
            </div>
            <div className="dado-item full-width">
              <label>Endereço:</label>
              <span>
                {usuario.endereco.logradouro}, {usuario.endereco.bairro}, {usuario.endereco.cidade} - {usuario.endereco.estado}, CEP: {usuario.endereco.cep}
              </span>
            </div>
          </div>
        </div>

        {/* Família */}
        <div className="container-perfil">
          <div className="section-header">
            <FaUsers className="section-icon" />
            <h3>Família</h3>
            <button 
              className="btn-expandir"
              onClick={() => setFamiliaExpandida(!familiaExpandida)}
            >
              {familiaExpandida ? "Recolher" : "Expandir"}
            </button>
          </div>

          {familiaExpandida ? (
            <div className="familia-expandida">
              {familia.map((membro, index) => (
                <div key={index} className="membro-familia">
                  <div className="membro-info">
                    <strong>{membro.nome}</strong>
                    <span>CPF: {membro.cpf}</span>
                    <span className="parentesco">{membro.parentesco}</span>
                  </div>
                  {membro.convenios.length > 0 && (
                    <div className="membro-convenios">
                      <strong>Convênio Titular:</strong>
                      {membro.convenios.map((conv, idx) => (
                        <span key={idx}>{conv.convenio} - {conv.carteirinha}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="familia-resumo">
              <p>{familia.length} membros na família</p>
              <span className="info">Clique em expandir para ver detalhes</span>
            </div>
          )}
        </div>

        {/* Convênios */}
        <div className="container-perfil">
          <div className="section-header">
            <FaFileMedical className="section-icon" />
            <h3>Meus Convênios</h3>
          </div>

          <div className="convenios-list">
            {convenios.map((convenio, index) => (
              <div key={index} className="convenio-item">
                <div className="convenio-header">
                  <strong>{convenio.convenio}</strong>
                  <span className="plano">{convenio.plano}</span>
                </div>
                <div className="convenio-detalhes">
                  <span>Carteirinha: {convenio.carteirinha}</span>
                  <span>Validade: {convenio.validade}</span>
                  {convenio.titular && <span>Titular: {convenio.titular}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="container-perfil">
          <div className="section-header">
            <h3>Ações Rápidas</h3>
          </div>

          <div className="acoes-grid">
            <Link to="/home_paciente/perfil/editar" className="acao-card">
              <FaEdit />
              <span>Editar Dados</span>
            </Link>
            <Link to="/home_paciente/perfil/historico" className="acao-card">
              <FaHistory />
              <span>Histórico de Consultas</span>
            </Link>
            <Link to="/convenios" className="acao-card">
              <FaFileMedical />
              <span>Convênios Aceitos</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PerfilPaciente;