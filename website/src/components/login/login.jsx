import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
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
      {/* <Header /> */}
      <div className="page-login">
        <div className="container-login">
          <p className="title">
            Acesse sua conta
          </p>

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

          <form onSubmit={handleSubmit} className="form-login">
            <div className="input-field">
              <label>Email:</label>
              <div className="input-with-icon">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label>Senha:</label>
              <div className="input-with-icon">
                <FaLock className="icon" />
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-login">
              Entrar
            </button>

            <div className="signup-link">
              <p>
                Não possui uma conta? <Link className="link" to="/cadastro">Cadastre-se</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;