import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import Header from "../header/header.jsx"
import Footer from "../footer/footer.jsx"
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("paciente");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Senha:", password);
    console.log("Tipo:", userType);
  };

  return (
    <>
      <Header />
      <div className="page">
        <div className="container">
          <div className="user-type-buttons">
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
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <h1>Clínica Bem Estar</h1>
            <h2>Login</h2>

            <div className="input-field">
              <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            <div className="input-field">
              <FaLock className="icon" />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />      
            </div>

            <div className="signup-link">
              <p>
                Não possui uma conta? <Link className="link" to="/cadastro"> Cadastro</Link>
              </p>
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
