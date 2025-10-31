import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('atendente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, tipo);
      navigate('/home');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError('Email ou senha incorretos');
      } else if (error.code === 'auth/user-not-found') {
        setError('Usuário não encontrado');
      } else if (error.code === 'auth/wrong-password') {
        setError('Senha incorreta');
      } else {
        setError(error.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-login">
      <div className="login-container">
        
        <p className="title">
          Clínica Médica
        </p>

        <p className="content">
          Faça login para acessar o sistema da clínica médica. Selecione o tipo de usuário e insira suas credenciais para continuar.
        </p>

        <div className="busca">
          <div className="container-busca">
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <label className="label-busca">Tipo de Usuário:</label>
                <div className="tipo-selector">
                  <button
                    className={`tipo-btn ${tipo === 'atendente' ? 'active' : ''}`}
                    onClick={() => setTipo('atendente')}
                    type="button"
                  >
                    Atendente
                  </button>
                  <button
                    className={`tipo-btn ${tipo === 'medico' ? 'active' : ''}`}
                    onClick={() => setTipo('medico')}
                    type="button"
                  >
                    Médico
                  </button>
                </div>
              </div>

              <div className="input-field">
                <label className="label-busca">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="input-field"
                />
              </div>

              <div className="input-field">
                <label className="label-busca">Senha:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="btn-buscar" 
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;