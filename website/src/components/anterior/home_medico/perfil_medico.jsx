import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./perfil_medico.css";
import HeaderMedico from "./header_medico.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaClock, FaStethoscope, FaHospital } from "react-icons/fa";

const PerfilMedico = () => {
  // Dados mockados do médico
  const [medico, setMedico] = useState({
    cpf: "987.654.321-00",
    nome: "Dr. Carlos Alberto Silva",
    email: "carlos.silva@clinica.com",
    telefone: "(11) 98888-7777",
    dataNascimento: "15/03/1980",
    crm: "CRM-SP 123.456",
    especialidade: "Cardiologia",
    subespecialidade: "Cardiologia Intervencionista",
    formacao: "Faculdade de Medicina da USP - 2005",
    residencia: "Residência em Cardiologia - INCOR 2008"
  });

  // Horários de trabalho
  const [horariosTrabalho, setHorariosTrabalho] = useState([
    {
      dia: "Segunda-feira",
      horarios: ["08:00 - 12:00", "14:00 - 18:00"],
      local: "Clínica Central"
    },
    {
      dia: "Terça-feira", 
      horarios: ["08:00 - 12:00", "14:00 - 18:00"],
      local: "Clínica Central"
    },
    {
      dia: "Quarta-feira",
      horarios: ["08:00 - 12:00"],
      local: "Hospital São Lucas"
    },
    {
      dia: "Quinta-feira",
      horarios: ["14:00 - 18:00"],
      local: "Clínica Central"
    },
    {
      dia: "Sexta-feira",
      horarios: ["08:00 - 12:00", "14:00 - 17:00"],
      local: "Clínica Central"
    }
  ]);

  return (
    <>
      <HeaderMedico />
      <div className="page-perfil">
        <p className="title">Meu Perfil</p>

        {/* Dados Pessoais */}
        <div className="container-perfil">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>Dados Pessoais</h3>
          </div>

          <div className="dados-grid">
            <div className="dado-item">
              <label>Nome Completo:</label>
              <span>{medico.nome}</span>
            </div>
            <div className="dado-item">
              <label>CPF:</label>
              <span>{medico.cpf}</span>
            </div>
            <div className="dado-item">
              <label>CRM:</label>
              <span>{medico.crm}</span>
            </div>
            <div className="dado-item">
              <label>Email:</label>
              <span>{medico.email}</span>
            </div>
            <div className="dado-item">
              <label>Telefone:</label>
              <span>{medico.telefone}</span>
            </div>
            <div className="dado-item">
              <label>Data de Nascimento:</label>
              <span>{medico.dataNascimento}</span>
            </div>
            <div className="dado-item full-width">
              <label>Especialidade Principal:</label>
              <span>{medico.especialidade}</span>
            </div>
            <div className="dado-item full-width">
              <label>Subespecialidade:</label>
              <span>{medico.subespecialidade}</span>
            </div>
            <div className="dado-item full-width">
              <label>Formação:</label>
              <span>{medico.formacao}</span>
            </div>
            <div className="dado-item full-width">
              <label>Residência:</label>
              <span>{medico.residencia}</span>
            </div>
          </div>
        </div>

        {/* Horários de Trabalho */}
        <div className="container-perfil">
          <div className="section-header">
            <FaClock className="section-icon" />
            <h3>Horários de Trabalho</h3>
          </div>

          <div className="horarios-grid">
            {horariosTrabalho.map((dia, index) => (
              <div key={index} className="dia-trabalho">
                <div className="dia-header">
                  <strong>{dia.dia}</strong>
                  <span className="local">{dia.local}</span>
                </div>
                <div className="horarios-list">
                  {dia.horarios.map((horario, idx) => (
                    <span key={idx} className="horario-item">
                      {horario}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informações Profissionais */}
        <div className="container-perfil">
          <div className="section-header">
            <FaStethoscope className="section-icon" />
            <h3>Informações Profissionais</h3>
          </div>

          <div className="info-profissional">
            <div className="info-item">
              <FaHospital className="info-icon" />
              <div>
                <strong>Locais de Atendimento</strong>
                <span>Clínica Central - Rua Principal, 123</span>
                <span>Hospital São Lucas - Av. Secundária, 456</span>
              </div>
            </div>
            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <strong>Tipos de Consulta</strong>
                <span>Presencial e Online</span>
                <span>Duração média: 30-45 minutos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PerfilMedico;