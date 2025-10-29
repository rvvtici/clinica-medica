import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./editar_perfil.css";
import HeaderPaciente from "../header/header_paciente.jsx";
import Footer from "../footer/footer.jsx";
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const EditarPerfil = () => {
  const [usuario, setUsuario] = useState({
    cpf: "123.456.789-00",
    nome: "João Silva Santos",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-8888",
    dataNascimento: "1985-05-15",
    sexo: "masculino",
    endereco: {
      cep: "01234-567",
      logradouro: "Rua das Flores",
      numero: "123",
      complemento: "Apartmento 45A",
      bairro: "Jardim Paulista",
      cidade: "São Paulo",
      estado: "SP"
    }
  });

  const [convenios, setConvenios] = useState([
    {
      id: 1,
      convenio: "Unimed",
      carteirinha: "UNI123456789",
      validade: "2024-12-31",
      plano: "Apartamento",
      titular: true
    }
  ]);

  const [novoConvenio, setNovoConvenio] = useState({
    convenio: "",
    carteirinha: "",
    validade: "",
    plano: "",
    titular: false
  });

  const handleUsuarioChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUsuario(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUsuario(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleConvenioChange = (index, field, value) => {
    const updatedConvenios = [...convenios];
    updatedConvenios[index][field] = value;
    setConvenios(updatedConvenios);
  };

  const addConvenio = () => {
    if (novoConvenio.convenio && novoConvenio.carteirinha) {
      setConvenios(prev => [...prev, { ...novoConvenio, id: Date.now() }]);
      setNovoConvenio({
        convenio: "",
        carteirinha: "",
        validade: "",
        plano: "",
        titular: false
      });
    }
  };

  const removeConvenio = (index) => {
    setConvenios(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados salvos:", { usuario, convenios });
    alert("Perfil atualizado com sucesso!");
  };

  return (
    <>
      <HeaderPaciente />
      <div className="page-perfil">
        <div className="page-header">
          <p className="title">Editar Perfil</p>
          <div className="header-actions">
            <Link to="/home_paciente/perfil" className="btn-cancelar">
              <FaTimes /> Cancelar
            </Link>
            <button onClick={handleSubmit} className="btn-salvar">
              <FaSave /> Salvar Alterações
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-editar">
          {/* Dados Pessoais */}
          <div className="container-perfil">
            <h3>Dados Pessoais</h3>
            
            <div className="form-grid">
              <div className="input-field">
                <label>Nome Completo:</label>
                <input
                  type="text"
                  value={usuario.nome}
                  onChange={(e) => handleUsuarioChange('nome', e.target.value)}
                  required
                />
              </div>

              <div className="input-field">
                <label>Email:</label>
                <input
                  type="email"
                  value={usuario.email}
                  onChange={(e) => handleUsuarioChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="input-field">
                <label>Telefone:</label>
                <input
                  type="tel"
                  value={usuario.telefone}
                  onChange={(e) => handleUsuarioChange('telefone', e.target.value)}
                  required
                />
              </div>

              <div className="input-field">
                <label>Data de Nascimento:</label>
                <input
                  type="date"
                  value={usuario.dataNascimento}
                  onChange={(e) => handleUsuarioChange('dataNascimento', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="endereco-section">
              <h4>Endereço</h4>
              <div className="form-grid">
                <div className="input-field">
                  <label>CEP:</label>
                  <input
                    type="text"
                    value={usuario.endereco.cep}
                    onChange={(e) => handleUsuarioChange('endereco.cep', e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label>Logradouro:</label>
                  <input
                    type="text"
                    value={usuario.endereco.logradouro}
                    onChange={(e) => handleUsuarioChange('endereco.logradouro', e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label>Número:</label>
                  <input
                    type="text"
                    value={usuario.endereco.numero}
                    onChange={(e) => handleUsuarioChange('endereco.numero', e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label>Complemento:</label>
                  <input
                    type="text"
                    value={usuario.endereco.complemento}
                    onChange={(e) => handleUsuarioChange('endereco.complemento', e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label>Bairro:</label>
                  <input
                    type="text"
                    value={usuario.endereco.bairro}
                    onChange={(e) => handleUsuarioChange('endereco.bairro', e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label>Cidade:</label>
                  <input
                    type="text"
                    value={usuario.endereco.cidade}
                    onChange={(e) => handleUsuarioChange('endereco.cidade', e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label>Estado:</label>
                  <input
                    type="text"
                    value={usuario.endereco.estado}
                    onChange={(e) => handleUsuarioChange('endereco.estado', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Convênios */}
          <div className="container-perfil">
            <h3>Convênios</h3>
            
            {convenios.map((convenio, index) => (
              <div key={convenio.id} className="convenio-editar">
                <div className="convenio-header">
                  <h4>Convênio {index + 1}</h4>
                  <button 
                    type="button" 
                    className="btn-remover"
                    onClick={() => removeConvenio(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
                
                <div className="form-grid">
                  <div className="input-field">
                    <label>Convênio:</label>
                    <input
                      type="text"
                      value={convenio.convenio}
                      onChange={(e) => handleConvenioChange(index, 'convenio', e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <label>Carteirinha:</label>
                    <input
                      type="text"
                      value={convenio.carteirinha}
                      onChange={(e) => handleConvenioChange(index, 'carteirinha', e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <label>Validade:</label>
                    <input
                      type="date"
                      value={convenio.validade}
                      onChange={(e) => handleConvenioChange(index, 'validade', e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <label>Plano:</label>
                    <input
                      type="text"
                      value={convenio.plano}
                      onChange={(e) => handleConvenioChange(index, 'plano', e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={convenio.titular}
                        onChange={(e) => handleConvenioChange(index, 'titular', e.target.checked)}
                      />
                      Sou o titular deste convênio
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {/* Adicionar Novo Convênio */}
            <div className="novo-convenio">
              <h4>Adicionar Convênio</h4>
              <div className="form-grid">
                <div className="input-field">
                  <label>Convênio:</label>
                  <input
                    type="text"
                    value={novoConvenio.convenio}
                    onChange={(e) => setNovoConvenio(prev => ({ ...prev, convenio: e.target.value }))}
                    placeholder="Ex: Unimed, Amil..."
                  />
                </div>

                <div className="input-field">
                  <label>Carteirinha:</label>
                  <input
                    type="text"
                    value={novoConvenio.carteirinha}
                    onChange={(e) => setNovoConvenio(prev => ({ ...prev, carteirinha: e.target.value }))}
                    placeholder="Número da carteirinha"
                  />
                </div>

                <div className="input-field">
                  <label>Validade:</label>
                  <input
                    type="date"
                    value={novoConvenio.validade}
                    onChange={(e) => setNovoConvenio(prev => ({ ...prev, validade: e.target.value }))}
                  />
                </div>

                <div className="input-field">
                  <label>Plano:</label>
                  <input
                    type="text"
                    value={novoConvenio.plano}
                    onChange={(e) => setNovoConvenio(prev => ({ ...prev, plano: e.target.value }))}
                    placeholder="Ex: Apartamento, Enfermaria..."
                  />
                </div>
              </div>

              <button type="button" onClick={addConvenio} className="btn-adicionar">
                <FaPlus /> Adicionar Convênio
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditarPerfil;