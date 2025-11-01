import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase/firebaseConfig';
import './Profile.css';
import HeaderAtendente from "../Atendente/HeaderAtendente";
import HeaderMedico from "../Medico/HeaderMedico";

const Profile = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Buscar dados do usuário na tabela users
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userInfo = snapshot.val();
            
            // Buscar dados completos na tabela específica (medico ou atendente)
            let detailedData = null;
            
            if (userType === 'medico') {
              const medicosRef = ref(database, 'medico');
              const medicosSnap = await get(medicosRef);
              
              if (medicosSnap.exists()) {
                const medicos = medicosSnap.val();
                // Procurar médico pelo email
                detailedData = Object.values(medicos).find(
                  m => m.email === userInfo.email
                );
              }
            } else if (userType === 'atendente') {
              const atendentesRef = ref(database, 'atendente');
              const atendentesSnap = await get(atendentesRef);
              
              if (atendentesSnap.exists()) {
                const atendentes = atendentesSnap.val();
                // Procurar atendente pelo email
                detailedData = Object.values(atendentes).find(
                  a => a.email === userInfo.email
                );
              }
            }
            
            setUserData({ ...userInfo, ...detailedData });
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, userType]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const diasSemana = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p className="title">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <>
      {userType === 'medico' ? (
        <HeaderMedico />
      ) : (
        <HeaderAtendente />
      )}
      
      <div className="profile-page">
        <h2 className="title">Meu Perfil</h2>
        

        {/* Dados Pessoais */}
        <div className="container-section">
          <h3 className="section-title">Dados Pessoais</h3>
          <div className="profile-data">
            <div className="data-row">
              <span className="data-label">Nome Completo:</span>
              <span className="data-value">{userData?.nomeCompleto || '-'}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Email:</span>
              <span className="data-value">{userData?.email || '-'}</span>
            </div>
            <div className="data-row">
              <span className="data-label">CPF:</span>
              <span className="data-value">{userData?.cpf || '-'}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Celular:</span>
              <span className="data-value">{userData?.celular || '-'}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Endereço:</span>
              <span className="data-value">{userData?.endereco || '-'}</span>
            </div>
            
            {userType === 'medico' && (
              <>
                <div className="data-row">
                  <span className="data-label">Data de Nascimento:</span>
                  <span className="data-value">{userData?.nascimento || '-'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">CRM:</span>
                  <span className="data-value">{userData?.crm || '-'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Especialidades:</span>
                  <span className="data-value">
                    {userData?.especialidades?.join(', ') || '-'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Horários de Trabalho */}
        <div className="container-section">
          <h3 className="section-title">Horários de Trabalho</h3>
          <div className="expediente-list">
            {userData?.expediente ? (
              Object.entries(diasSemana).map(([key, dia]) => {
                const horario = userData.expediente[key];
                const trabalha = horario?.inicio && horario?.fim;
                
                return (
                  <div key={key} className="expediente-row">
                    <span className="dia-semana">{dia}</span>
                    <span className={`horario-value ${!trabalha ? 'folga' : ''}`}>
                      {trabalha 
                        ? `${horario.inicio} - ${horario.fim}`
                        : '-'
                      }
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="sem-dados">Horários não cadastrados</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;