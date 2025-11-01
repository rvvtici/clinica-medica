import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../Firebase/firebaseConfig";
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import BuscaMedico from "./BuscaMedico";
import "./especialidades.css";

import HeaderAtendente from "../Atendente/HeaderAtendente"
import HeaderMedico from "../Medico/HeaderMedico"

const Especialidades = () => {
  const { user, userType, logout } = useAuth();
  const [especialidades, setEspecialidades] = useState([]);
  const [exames, setExames] = useState([]);
  const [expandedEsp, setExpandedEsp] = useState({});
  const [expandedExam, setExpandedExam] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const medicosRef = ref(database, "medico");
        const consultasTipoRef = ref(database, "consultasTipo");
        const examesTipoRef = ref(database, "examesTipo");
        const convenioClinicaRef = ref(database, "convenioClinica");

        const [medicosSnap, consultasTipoSnap, examesTipoSnap, convenioSnap] = await Promise.all([
          get(medicosRef),
          get(consultasTipoRef),
          get(examesTipoRef),
          get(convenioClinicaRef)
        ]);

        const dadosMedicos = medicosSnap.exists() ? medicosSnap.val() : {};
        const dadosConsultasTipo = consultasTipoSnap.exists() ? consultasTipoSnap.val() : {};
        const dadosExamesTipo = examesTipoSnap.exists() ? examesTipoSnap.val() : {};
        const dadosConvenios = convenioSnap.exists() ? convenioSnap.val() : {};

        // Processar especialidades
        const mapEsp = {};
        Object.values(dadosConsultasTipo).forEach((consulta) => {
          const esp = consulta.especialidade;
          if (!mapEsp[esp]) {
            mapEsp[esp] = {
              nome: esp,
              preco: consulta.preco,
              medicos: []
            };
          }
        });

        // Adicionar médicos às especialidades
        Object.values(dadosMedicos).forEach((medico) => {
          const espList = medico.especialidades || [];
          const cpfNumerico = medico.cpfNumerico;
          
          // Buscar convênios do médico
          const conveniosMedico = [];
          Object.values(dadosConvenios).forEach((conv) => {
            if (conv.medicos && conv.medicos.includes(cpfNumerico)) {
              conveniosMedico.push(conv.nome);
            }
          });

          espList.forEach((esp) => {
            if (mapEsp[esp]) {
              mapEsp[esp].medicos.push({
                nome: medico.nomeCompleto || medico.nome || "—",
                crm: medico.crm || "",
                convenios: conveniosMedico
              });
            }
          });
        });

        setEspecialidades(Object.values(mapEsp));

        // Processar exames
        const listaExames = Object.values(dadosExamesTipo).map((exame) => {
          const conveniosExame = (exame.coberturaConvenio || []).map((idConv) => {
            return dadosConvenios[idConv]?.nome || idConv;
          });

          return {
            tipo: exame.tipo,
            preco: exame.preco,
            convenios: conveniosExame
          };
        });

        setExames(listaExames);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  const toggleEspecialidade = (idx) => {
    setExpandedEsp(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleExame = (idx) => {
    setExpandedExam(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="page-especialidades">
        <p className="title">Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <header>
        {userType === 'medico' ? (
          <HeaderMedico />
        ) : (
          <HeaderAtendente />
        )}
      </header>
      <div className="page-especialidades">
        <h2 className="title">Especialidades</h2>

        <p className="content">
          Confira abaixo as especialidades médicas disponíveis em nossa clínica, 
          os exames oferecidos e utilize a busca para encontrar profissionais específicos.
        </p>

{/* Container de Especialidades Médicas */}
<div className="container-section">
  <h3 className="section-title">Especialidades Médicas</h3>
  <div className="container-especialidades">
    {especialidades.map((esp, idx) => (
      <div key={idx} className="card-especialidade">
        <div className="card-especialidade-head">
          <span className="nome-especialidade">{esp.nome}</span>
          <span className="preco-especialidade">
            R$ {Number(esp.preco).toFixed(2)}
          </span>
        </div>

        <div className="card-especialidade-body">
          <ul>
            {esp.medicos.map((m, i) => (
              <li key={i}>
                {m.nome} {m.crm ? `- CRM ${m.crm}` : ""}
                {m.convenios.length > 0 && (
                  <span className="convenios-tag">
                    ({m.convenios.join(", ")})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Container de Exames */}
<div className="container-section">
  <h3 className="section-title">Exames</h3>
  <div className="container-especialidades">
    {exames.map((exame, idx) => (
      <div key={idx} className="card-especialidade">
        <div className="card-especialidade-head">
          <span className="nome-especialidade">{exame.tipo}</span>
          <span className="preco-especialidade">
            R$ {Number(exame.preco).toFixed(2)}
          </span>
        </div>

        <div className="card-especialidade-body">
          {exame.convenios.length > 0 ? (
            <p className="convenios-list">Convênios: {exame.convenios.join(", ")}</p>
          ) : (
            <p className="convenios-list">Nenhum convênio disponível</p>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

        <hr className="divisor" />

        {/* Container de Busca */}
        <div className="container-busca-wrapper">
          <h3 className="section-title">Buscar Médico</h3>
          <div className="busca-container-inner">
            <BuscaMedico />
          </div>
        </div>
      </div>
    </>
  );
};

export default Especialidades;