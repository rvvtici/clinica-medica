import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './Home.css';

import HomeMedico from "../Medico/HomeMedico";
import HomeAtendente from "../Atendente/HomeAtendente";

const Home = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="home-container">
      {/* <header className="home-header">
        <h1>Clínica Médica</h1>
        <div className="user-info">
          <span className="user-badge">{userType === 'medico' ? 'Médico' : 'Atendente'}</span>
          <span className="user-email">{user?.email}</span>
          <button onClick={handleProfile} className="profile-btn">Perfil</button>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header> */}

      <main className="home-main">
        {userType === 'medico' ? (
            <HomeMedico />
        ) : (
          <div className="dashboard atendente-dashboard">
            <HomeAtendente />
            {/* <h2>Bem-vindo ao Sistema!</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Atendimentos Hoje</h3>
                <p className="dashboard-number">28</p>
              </div>
              <div className="dashboard-card">
                <h3>Sala de Espera</h3>
                <p className="dashboard-number">5</p>
              </div>
              <div className="dashboard-card">
                <h3>Próximo Paciente</h3>
                <p className="dashboard-text">Maria Santos</p>
              </div>
            </div>
            
            <div className="menu-section">
              <h3>Menu do Atendente</h3>
              <div className="menu-buttons">
                <button className="menu-btn">Novo Agendamento</button>
                <button className="menu-btn">Pacientes</button>
                <button className="menu-btn">Agenda</button>
                <button className="menu-btn">Financeiro</button>
              </div>
            </div> */}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;