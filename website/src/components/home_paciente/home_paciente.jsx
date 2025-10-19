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
      <Header />
      <HeaderPaciente />

      <div class="user">
        <p>Boas-vindas, nome_paciente</p>
        <p></p>
      </div>

      <div class="container-item">
        <p>
          consultas também podem ser realizadas e cobertas pelos nossos convênios cadastrados. 
          <Link className="link" to="/convenios">Cadastrar convênio.</Link>
        </p>
      </div>


      <div class="container-item">
        <p>
          Nossas consultas podem ser realizadas tanto presencialmente quanto na nossa plataforma online.
          A lista de especialidades médicas pode ser acessada
          {/* <Link className="teste" to="/especialidades">aqui.</Link> */}
           aqui.
          Caso em problemas, a consulta pode ser marcada também pelo contato (11) 2912-4294 
          <Link className="link" to="/convenios">Marcar consulta</Link>
        </p>
      </div>


      <div class="container-item">
        <p>
          Acessar nossa plataforma de consultas online
          <Link className="link" to="/convenios">Consultas online</Link>
        </p>
      </div>


      <div class="container-item">
        <p>
          Acesse informações de consultas realizadas e previstas, exames, atestados e receitas.
          <Link className="link" to="/convenios">Histórico de consultas</Link>
        </p>
      </div>


      <div class="container-item">
        <p>
          Lista de médicas, seus dados e especialidades
          <Link className="link" to="/convenios">Especialidades médicas</Link>
        </p>
      </div>



      <div class="container-item">
        <p>
          Informações dos convênios
          <Link className="link" to="/convenios">Nossos convênios</Link>
        </p>
      </div>

      <Footer />
    </>
  );
};

export default HomePaciente;
