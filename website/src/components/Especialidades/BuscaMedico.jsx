import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../Firebase/firebaseConfig";
import "./especialidades.css";

const BuscaMedico = () => {
  const [query, setQuery] = useState("");
  const [convenio, setConvenio] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [convenios, setConvenios] = useState({});
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const conveniosRef = ref(database, "convenioClinica");
        const medicosRef = ref(database, "medico");
        const conveniosSnapshot = await get(conveniosRef);
        const medicosSnapshot = await get(medicosRef);

        const dadosConvenios = conveniosSnapshot.exists() ? conveniosSnapshot.val() : {};
        const dadosMedicos = medicosSnapshot.exists() ? medicosSnapshot.val() : {};

        const listaMedicos = Object.values(dadosMedicos).map((medico) => {
          const conveniosMedico = Object.values(dadosConvenios)
            .filter((conv) => conv.medicos && conv.medicos.includes(medico.cpfNumerico))
            .map((conv) => conv.nome);

          return {
            nome: medico.nomeCompleto || medico.nome || "—",
            crm: medico.crm || "",
            especialidades: medico.especialidades || [],
            convenios: conveniosMedico,
            cpf: medico.cpfNumerico || medico.cpf || "",
          };
        });

        // organizar convenios -> especialidades
        const conveniosOrganizados = {};
        Object.values(dadosConvenios).forEach((conv) => {
          conveniosOrganizados[conv.nome] = [];

          if (conv.medicos) {
            conv.medicos.forEach((cpfMedico) => {
              const medico = dadosMedicos[cpfMedico];
              if (medico && medico.especialidades) {
                medico.especialidades.forEach((esp) => {
                  if (!conveniosOrganizados[conv.nome].includes(esp)) {
                    conveniosOrganizados[conv.nome].push(esp);
                  }
                });
              }
            });
          }
        });

        setConvenios(conveniosOrganizados);
        setMedicos(listaMedicos);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  const handleConvenio = (e) => {
    setConvenio(e.target.value);
    setEspecialidade("");
  };

  // 🔍 Busca automática conforme o usuário digita
  useEffect(() => {
    if (query.trim() === "") {
      setResultadosBusca([]);
      return;
    }

    const resultados = medicos.filter((medico) =>
      medico.nome.toLowerCase().includes(query.toLowerCase())
    );
    setResultadosBusca(resultados);
  }, [query, medicos]);

  if (loading) {
    return <p>Carregando busca...</p>;
  }

  return (
    <div className="busca">




      <div className="container-busca">
        <label>Médico:</label>
        <input
          type="text"
          placeholder="Digite o nome do médico"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-medico"
        />

        {query && resultadosBusca.length > 0 && (
          <div className="resultados-busca">
            <h4>Resultados da busca:</h4>
            {resultadosBusca.map((m, index) => (
              <div key={index} className="result">
                <p><strong>{m.nome}</strong></p>
                <p>Convênios: {m.convenios.join(", ")}</p>
                <p>Especialidades: {m.especialidades.join(", ")}</p>
                <p>CRM: {m.crm}</p>
              </div>
            ))}
          </div>
        )}

        {query && resultadosBusca.length === 0 && (
          <div className="result">
            <p>Nenhum médico encontrado com o nome "{query}"</p>
          </div>
        )}
      </div>




      <div className="ou"><p>ou</p></div>



      <div className="container-busca">
        <label>Convênio:</label>
        <select
          value={convenio}
          onChange={handleConvenio}
          className="select-field"
        >
          <option value="">Selecione um convênio</option>
          {Object.keys(convenios).map((conv) => (
            <option key={conv} value={conv}>
              {conv}
            </option>
          ))}
        </select>

        <label>Especialidade:</label>
        <select
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          className="select-field"
          disabled={!convenio}
        >
          <option value="">
            {convenio
              ? "Selecione uma especialidade"
              : "Escolha um convênio primeiro"}
          </option>
          {convenio &&
            convenios[convenio].map((esp) => (
              <option key={esp} value={esp}>
                {esp}
              </option>
            ))}
        </select>

        {especialidade && (
          <div className="resultados-especialidade">
            <h4>Médicos disponíveis em {especialidade}:</h4>
            {medicos
              .filter(
                (m) =>
                  m.especialidades.includes(especialidade) &&
                  m.convenios.includes(convenio)
              )
              .map((m, index) => (
                <div key={index} className="result">
                  <p><strong>{m.nome}</strong></p>
                  <p>Convênios: {m.convenios.join(", ")}</p>
                  <p>Especialidades: {m.especialidades.join(", ")}</p>
                  <p>CRM: {m.crm}</p>
                </div>
              ))}
          </div>
        )}
      </div>




    </div>
  );
};

export default BuscaMedico;
