import React, { useState, useEffect } from "react";
import { useAuth } from '../Auth/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase/firebaseConfig';
import "./convenios.css";
import HeaderAtendente from "../Atendente/HeaderAtendente";
import HeaderMedico from "../Medico/HeaderMedico";

const Convenio = () => {
  const [convenios, setConvenios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, userType, logout } = useAuth();

  useEffect(() => {
    const buscarConvenios = async () => {
      try {
        const conveniosRef = ref(database, 'convenioClinica');
        const medicosRef = ref(database, 'medico');
        const examesRef = ref(database, 'examesTipo');
        
        const [conveniosSnap, medicosSnap, examesSnap] = await Promise.all([
          get(conveniosRef),
          get(medicosRef),
          get(examesRef)
        ]);
        
        const dadosConvenios = conveniosSnap.exists() ? conveniosSnap.val() : {};
        const dadosMedicos = medicosSnap.exists() ? medicosSnap.val() : {};
        const dadosExames = examesSnap.exists() ? examesSnap.val() : {};
        
        const listaConvenios = Object.values(dadosConvenios).map(conv => {
          // Buscar especialidades cobertas
          const especialidades = new Set();
          if (conv.medicos) {
            conv.medicos.forEach(cpfMedico => {
              const medico = dadosMedicos[cpfMedico];
              if (medico && medico.especialidades) {
                medico.especialidades.forEach(esp => especialidades.add(esp));
              }
            });
          }
          
          // Buscar exames cobertos
          const examesCobertos = Object.values(dadosExames)
            .filter(exame => 
              exame.coberturaConvenio && 
              exame.coberturaConvenio.includes(conv.idConv)
            )
            .map(exame => exame.tipo);
          
          return {
            id: conv.idConv,
            nome: conv.nome,
            especialidades: Array.from(especialidades).sort(),
            exames: examesCobertos.sort()
          };
        });
        
        setConvenios(listaConvenios);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar convênios:', error);
        setLoading(false);
      }
    };
    
    buscarConvenios();
  }, []);

  if (loading) {
    return (
      <div className="page-convenios">
        <p className="title">Carregando...</p>
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
      <div className="page-convenios">        
        <p className="title">Convênios</p>
        
        <p className="content">
          Confira abaixo os convênios aceitos pela clínica, incluindo as 
          especialidades médicas e exames cobertos por cada plano.
        </p>
    
        <div className="lista-convenios">
          {convenios.map((conv) => (
            <div key={conv.id} className="card-convenio">
              <h3 className="nome-convenio">{conv.nome}</h3>
              
              <div className="convenio-info">
                <div className="convenio-section">
                  <p className="convenio-label">Especialidades cobertas:</p>
                  {conv.especialidades.length > 0 ? (
                    <p className="convenio-lista">{conv.especialidades.join(", ")}</p>
                  ) : (
                    <p className="convenio-lista">Nenhuma especialidade cadastrada</p>
                  )}
                </div>
                
                <div className="convenio-section">
                  <p className="convenio-label">Exames cobertos:</p>
                  {conv.exames.length > 0 ? (
                    <p className="convenio-lista">{conv.exames.join(", ")}</p>
                  ) : (
                    <p className="convenio-lista">Nenhum exame cadastrado</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Convenio;