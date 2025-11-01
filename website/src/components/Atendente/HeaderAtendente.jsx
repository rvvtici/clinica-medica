import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './HeaderAtendente.css';

const HeaderAtendente = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };




    return(
              <header className="header-atendente">
        <div>
        <h1>Clínica Médica</h1>

        </div>
        <div className="user-info">
          
          <p onClick={() => navigate('/home')} >Home</p>
          <p onClick={() => navigate('/especialidades')} >Especialidades</p>
          <p onClick={() => navigate('/convenios')} >Convênios</p>
        </div>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <button onClick={() => navigate('/profile')} className="profile-btn">
            Perfil
          </button>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>
    )
}

export default HeaderAtendente;