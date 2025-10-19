import React from "react";
import "./consulta_medico.css";
import { FaHospital } from "react-icons/fa";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import HeaderMedico from "./header_medico.jsx";

const ConsultaMedico = () => {
  return (
    <>
    <Header />
    <HeaderMedico />
      <h1>Consulta</h1>
      
      {/* lado a lado */}
      <div id="holder-consulta-anterior-proxima">

      </div>

      <div class="consulta-anterior-proxima">
        {/* <div class="consulta-anterior-proxima">
          <h2>Consulta Anterior</h2>
          <p>Jonas</p>
        </div> */}
        <div class="consulta-anterior-proxima">
          <h2>Próxima Consulta</h2>
        </div>
      </div>

{/* maior doq as 2 consultas acima */}
      <h2>Consulta Atual</h2>
      <div class="paciente_atual">
        <p>Jonas Ferreira Junior - </p>
        <p>14h20</p>
        <p>info gerais</p>  
        <p>observações: possui diabetes ii</p>
        <button>Histórico de Consultas</button>
        <button>Resultado de Exames</button>
        <button>Receita</button>
        <button>Atestado</button>
        <p>Adicionar observações:</p>
        <input></input>
        <button></button>
      </div>

      {/* experiencias, bibliotecas implementadas, coisas p melhorar etc */}

      <h2>Buscar paciente por CPF</h2>
      <input></input>
      <button></button>
    <Footer />
    </>
  );
};

export default ConsultaMedico;
