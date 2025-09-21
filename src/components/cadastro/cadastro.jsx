import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./cadastro.css";
import Header from "../header/header.jsx"
import Footer from "../footer/footer.jsx"
import { FaUser, FaLock } from "react-icons/fa";

const Cadastro = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("paciente");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Usuário:", username);
    console.log("Senha:", password);
    console.log("Tipo:", userType);
  };

  return (
    <>
      <Header />
      <div className="page">
        <div className="container">
          {/* <div className="user-type-buttons">
            <button
              type="button"
              className={userType === "paciente" ? "active" : ""}
              onClick={() => setUserType("paciente")}
            >
              Paciente
            </button>
            <button
              type="button"
              className={userType === "funcionario" ? "active" : ""}
              onClick={() => setUserType("funcionario")}
            >
              Funcionário
            </button>
          </div> */}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <h1>Clínica Bem Estar</h1>
            <h2>Cadastro</h2>

            <div className="input-field">
              {/* <FaUser className="icon" /> */}
              <input
                type="Nome"
                placeholder="Nome Completo"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-field">
              {/* <FaUser className="icon" /> */}
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-field">
              {/* <FaUser className="icon" /> */}
              <input
                type="endereco"
                placeholder="Endereço"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-field">
              {/* <FaUser className="icon" /> */}
              <input
                type="telefone"
                placeholder="Telefone"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-field">
              {/* <FaLock className="icon" /> */}
              <input
                type="password"
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="signup-link">
              <p>
                Já possui conta? <Link className="link" to="/">Login</Link>
              </p>
              <button>Cadastrar</button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cadastro;
