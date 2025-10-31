import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase/firebaseConfig';
import './Profile.css';

const Profile = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="header-left">
          <button onClick={handleBackToHome} className="back-btn">
            ← Voltar
          </button>
          <h1>Meu Perfil</h1>
        </div>
        <button onClick={handleLogout} className="logout-btn">Sair</button>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className={`avatar-circle ${userType}`}>
              {userData?.nome?.charAt(0) || 'U'}
            </div>
          </div>

          <div className="profile-info">
            <h2>{userData?.nome || 'Nome não disponível'}</h2>
            <span className={`badge ${userType}`}>
              {userType === 'medico' ? '👨‍⚕️ Médico' : '👔 Atendente'}
            </span>
          </div>

          <div className="profile-details">
            <div className="detail-section">
              <h3>Informações Pessoais</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nome Completo</label>
                  <p>{userData?.nome || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{userData?.email || user?.email || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Tipo de Usuário</label>
                  <p className="capitalize">{userData?.tipo || '-'}</p>
                </div>
                {userType === 'medico' && userData?.crm && (
                  <div className="detail-item">
                    <label>CRM</label>
                    <p>{userData.crm}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>Informações do Sistema</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>UID (Token Firebase)</label>
                  <p className="uid-text">{user?.uid || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p className="status-active">✓ Ativo</p>
                </div>
              </div>
            </div>

            {userType === 'medico' ? (
              <div className="detail-section stats-section">
                <h3>Estatísticas</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                      <p className="stat-number">127</p>
                      <p className="stat-label">Consultas este mês</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-info">
                      <p className="stat-number">8.5h</p>
                      <p className="stat-label">Média diária</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                      <p className="stat-number">4.9</p>
                      <p className="stat-label">Avaliação média</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="detail-section stats-section">
                <h3>Estatísticas</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                      <p className="stat-number">342</p>
                      <p className="stat-label">Agendamentos este mês</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📞</div>
                    <div className="stat-info">
                      <p className="stat-number">89</p>
                      <p className="stat-label">Atendimentos hoje</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                      <p className="stat-number">98%</p>
                      <p className="stat-label">Taxa de conclusão</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button className="action-btn primary" onClick={handleBackToHome}>
              Ir para Dashboard
            </button>
            <button className="action-btn secondary" onClick={handleLogout}>
              Sair do Sistema
            </button>
          </div>
        </div>

        <div className="debug-info">
          <h4>🔍 Debug - Dados do Token</h4>
          <pre>{JSON.stringify({ user, userType, userData }, null, 2)}</pre>
        </div>
      </main>
    </div>
  );
};

export default Profile;