import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./cadastro.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaSearch } from "react-icons/fa";

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    endereco: "",
    telefone: "",
    dataNascimento: "",
    password: "",
    cep: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  const [loadingCep, setLoadingCep] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const buscarCep = async () => {
    if (!formData.cep || formData.cep.length !== 8) return;
    
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
      } else {
        alert("CEP não encontrado!");
      }
    } catch (error) {
      alert("Erro ao buscar CEP!");
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepBlur = () => {
    if (formData.cep.length === 8) {
      buscarCep();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Dados do formulário:", formData);
  };

  return (
    <>
      {/* <Header /> */}
      <div className="page-cadastro">
        <div className="container-cadastro">
          <p className="title">
            Crie sua conta
          </p>

          <form onSubmit={handleSubmit} className="form-cadastro">
            {/* Dados Pessoais */}
            <div className="form-section">
              <h3 className="section-title">Dados Pessoais</h3>
              
              <div className="input-field">
                <label>Nome Completo:</label>
                <div className="input-with-icon">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    name="nome"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>Email:</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Digite seu email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Telefone:</label>
                  <div className="input-with-icon">
                    <FaPhone className="icon" />
                    <input
                      type="tel"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="input-field">
                <label>Data de Nascimento:</label>
                <div className="input-with-icon">
                  <FaCalendarAlt className="icon" />
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="form-section">
              <h3 className="section-title">Endereço</h3>
              
              <div className="input-field">
                <label>CEP:</label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="icon" />
                  <input
                    type="text"
                    name="cep"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={handleChange}
                    onBlur={handleCepBlur}
                    maxLength="8"
                  />
                  <button 
                    type="button" 
                    className="btn-buscar-cep"
                    onClick={buscarCep}
                    disabled={loadingCep || formData.cep.length !== 8}
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>Endereço:</label>
                  <input
                    type="text"
                    name="endereco"
                    placeholder="Rua, Avenida, etc."
                    value={formData.endereco}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field">
                  <label>Número:</label>
                  <input
                    type="text"
                    name="numero"
                    placeholder="Nº"
                    value={formData.numero}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-field">
                <label>Complemento:</label>
                <input
                  type="text"
                  name="complemento"
                  placeholder="Apartamento, bloco, etc."
                  value={formData.complemento}
                  onChange={handleChange}
                />
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>Bairro:</label>
                  <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field">
                  <label>Cidade:</label>
                  <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field">
                  <label>Estado:</label>
                  <input
                    type="text"
                    name="estado"
                    placeholder="UF"
                    value={formData.estado}
                    onChange={handleChange}
                    maxLength="2"
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div className="form-section">
              <h3 className="section-title">Segurança</h3>
              
              <div className="input-field">
                <label>Senha:</label>
                <div className="input-with-icon">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-cadastro">
              Cadastrar
            </button>

            <div className="login-link">
              <p>
                Já possui conta? <Link className="link" to="/">Faça login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cadastro;