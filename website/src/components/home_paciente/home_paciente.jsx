import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home_paciente.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import HeaderPaciente from "../header/header_paciente.jsx"
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const HomePaciente = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <HeaderPaciente />
      <div className="page-home-paciente">

        <div className="title">
          <p>Área do Paciente</p>
        </div>

        <div className="user">
          <p>Boas-vindas, nome_paciente!</p>
        </div>

        <div className="container-item">
          <h1 className="title-item">
            Meu Convênio
          </h1>
          <p className="subtitle-item">
            Consulte e gerencie suas informações de convênio, cobertura e dados cadastrais.
          </p>
          <button className="button-item">
            <Link className="link" to="/home_paciente/perfil/convenio">Gerenciar Convênio</Link>
          </button>
        </div>

        <div className="container-item">
          <h1 className="title-item">
            Agendar Consulta
          </h1>
          <p className="subtitle-item">
            Nossas consultas podem ser realizadas tanto presencialmente quanto na nossa plataforma online.
            A lista de especialidades médicas pode ser acessada aqui.
            Caso tenha problemas, a consulta pode ser marcada também pelo contato (11) 2912-4294.
          </p>
          <button className="button-item">
            <Link className="link" to="/especialidades">Ver Especialidades</Link>
          </button>
        </div>

        <div className="container-item">
          <h1 className="title-item">
            Consulta Online
          </h1>
          <p className="subtitle-item">
            Acesse nossa plataforma para consultas remotas com nossos especialistas.
            
          </p>
          <button className="button-item">
            <Link className="link" to="/home_paciente/online">Iniciar Consulta</Link>
          </button>
        </div>

        <div className="container-item">
          <h1 className="title-item">
            Histórico Médico
          </h1>
          <p className="subtitle-item">
            Acesse informações de consultas realizadas e agendadas, exames, atestados e receitas médicas.
          </p>
          <button className="button-item">
            <Link className="link" to="/home_paciente/perfil/historico">Ver Histórico</Link>
          </button>
        </div>

        <div className="container-item">
          <h1 className="title-item">
            Especialidades
          </h1>
          <p className="subtitle-item">
            Conheça nossa equipe médica, especialidades disponíveis e dados profissionais.
          </p>
          <button className="button-item">
            <Link className="link" to="/especialidades">Ver Especialistas</Link>
          </button>
        </div>

        <div className="container-item">
          <h1 className="title-item">
            Convênios Parceiros
          </h1>
          <p className="subtitle-item">
            Confira a lista completa de convênios aceitos e suas coberturas.
          </p>
          <button className="button-item">
            <Link className="link" to="/convenios">Ver Convênios</Link>
          </button>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default HomePaciente;