import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./cadastro.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaLock } from "react-icons/fa";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Nome:", nome);
    console.log("Email:", email);
    console.log("Endereço:", endereco);
    console.log("Telefone:", telefone);
    console.log("Data de Nascimento:", dataNascimento);
    console.log("Senha:", password);
  };

  return (
    <>
      <Header />
      <div className="page">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <h1>Clínica Bem Estar</h1>
            <h2>Cadastro</h2>

            <div className="input-field">
              <input
                type="text"
                placeholder="Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <input
                type="tel"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <input
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>

            <div className="input-field">
              <input
                type="date"
                placeholder="Data de Nascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </div>

            <div className="input-field">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="signup-link">
              <p>
                Já possui conta? <Link className="link" to="/">Login</Link>
              </p>
              <button type="submit">Cadastrar</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cadastro;
