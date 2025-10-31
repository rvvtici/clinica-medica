import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase/firebaseConfig';
import './HomeAtendente.css';
import { FaSearch, FaCalendarAlt, FaChevronDown, FaChevronUp, FaFileMedical, FaHistory, FaPrescription, FaFlask, FaEdit } from 'react-icons/fa';
import HeaderAtendente from "./HeaderAtendente"

const HomeAtendente = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados para busca de paciente
  const [cpfBusca, setCpfBusca] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [dadosAdicionais, setDadosAdicionais] = useState(null);
  const [convenios, setConvenios] = useState([]);
  const [consultasPaciente, setConsultasPaciente] = useState([]);
  const [expandidoConsultas, setExpandidoConsultas] = useState(false);
  const [expandidoExames, setExpandidoExames] = useState(false);
  const [expandidoConsulta, setExpandidoConsulta] = useState({});
  
  // Estados para agendamento
  const [buscaMedico, setBuscaMedico] = useState({
    especialidade: '',
    nome: ''
  });
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);
  const [conveniosMedico, setConveniosMedico] = useState([]);
  const [agendaMedico, setAgendaMedico] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [horariosdia, setHorariosDia] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const formatarCPF = (cpf) => {
    return cpf.replace(/\D/g, '');
  };

  const handleBuscarPaciente = async () => {
    const cpfFormatado = formatarCPF(cpfBusca);
    
    try {
      // Busca dados do paciente
      const pacienteRef = ref(database, `paciente/${cpfFormatado}`);
      const pacienteSnapshot = await get(pacienteRef);
      
      if (!pacienteSnapshot.exists()) {
        alert('Paciente não encontrado');
        setPacienteEncontrado(null);
        return;
      }
      
      const dadosPaciente = pacienteSnapshot.val();
      setPacienteEncontrado(dadosPaciente);
      
      // Busca dados adicionais
      const dadosAdRef = ref(database, `dadosAdicionaisPaciente/${cpfFormatado}`);
      const dadosAdSnapshot = await get(dadosAdRef);
      if (dadosAdSnapshot.exists()) {
        setDadosAdicionais(dadosAdSnapshot.val());
      }
      
      // Busca convênios do paciente
      const conveniosRef = ref(database, 'convenioPaciente');
      const conveniosSnapshot = await get(conveniosRef);
      if (conveniosSnapshot.exists()) {
        const todosConvenios = conveniosSnapshot.val();
        const conveniosPaciente = Object.values(todosConvenios).filter(
          conv => conv.cpf === cpfFormatado
        );
        
        // Busca nomes dos convênios
        const conveniosComNome = await Promise.all(
          conveniosPaciente.map(async (conv) => {
            const convRef = ref(database, `convenioClinica/${conv.idConv}`);
            const convSnapshot = await get(convRef);
            return {
              ...conv,
              nome: convSnapshot.exists() ? convSnapshot.val().nome : 'Desconhecido'
            };
          })
        );
        setConvenios(conveniosComNome);
      }
      
      // Busca consultas do paciente
      const consultasRef = ref(database, 'consulta');
      const consultasSnapshot = await get(consultasRef);
      if (consultasSnapshot.exists()) {
        const todasConsultas = consultasSnapshot.val();
        const consultasPac = Object.values(todasConsultas).filter(
          cons => cons.cpfPaciente === cpfFormatado
        );
        
        // Busca dados dos médicos e registros médicos
        const consultasComMedico = await Promise.all(
          consultasPac.map(async (consulta) => {
            const medicoRef = ref(database, `medico/${consulta.cpfMedico}`);
            const medicoSnapshot = await get(medicoRef);
            
            // Busca registro médico da consulta
            const registrosRef = ref(database, 'registroMedico');
            const registrosSnapshot = await get(registrosRef);
            let registroConsulta = null;
            
            if (registrosSnapshot.exists()) {
              const todosRegistros = registrosSnapshot.val();
              registroConsulta = Object.values(todosRegistros).find(
                reg => reg.idConsulta === consulta.idConsulta
              );
            }
            
            return {
              ...consulta,
              nomeMedico: medicoSnapshot.exists() ? medicoSnapshot.val().nomeCompleto : 'Desconhecido',
              registro: registroConsulta
            };
          })
        );
        
        setConsultasPaciente(consultasComMedico);
      }
      
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      alert('Erro ao buscar paciente');
    }
  };

  const handleBuscarMedicos = async () => {
    try {
      const medicosRef = ref(database, 'medico');
      const medicosSnapshot = await get(medicosRef);
      
      if (!medicosSnapshot.exists()) {
        alert('Nenhum médico encontrado');
        return;
      }
      
      const todosMedicos = medicosSnapshot.val();
      let medicosFiltrados = Object.values(todosMedicos);
      
      // Filtra por especialidade
      if (buscaMedico.especialidade) {
        medicosFiltrados = medicosFiltrados.filter(medico =>
          medico.especialidades && medico.especialidades.includes(buscaMedico.especialidade)
        );
      }
      
      // Filtra por nome
      if (buscaMedico.nome) {
        medicosFiltrados = medicosFiltrados.filter(medico =>
          medico.nomeCompleto.toLowerCase().includes(buscaMedico.nome.toLowerCase())
        );
      }
      
      if (medicosFiltrados.length === 0) {
        alert('Nenhum médico encontrado com esses critérios');
        setMedicoSelecionado(null);
        return;
      }
      
      // Seleciona o primeiro médico encontrado
      const medico = medicosFiltrados[0];
      setMedicoSelecionado(medico);
      
      // Busca convênios que o médico atende
      const conveniosRef = ref(database, 'convenioClinica');
      const conveniosSnapshot = await get(conveniosRef);
      
      if (conveniosSnapshot.exists()) {
        const todosConvenios = conveniosSnapshot.val();
        const conveniosMed = Object.values(todosConvenios).filter(conv =>
          conv.medicos && conv.medicos.includes(medico.cpfNumerico)
        );
        setConveniosMedico(conveniosMed);
      }
      
      // Busca agenda do médico
      const agendaRef = ref(database, `agenda/${medico.idAgenda}`);
      const agendaSnapshot = await get(agendaRef);
      
      if (agendaSnapshot.exists()) {
        setAgendaMedico(agendaSnapshot.val());
      }
      
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      alert('Erro ao buscar médicos');
    }
  };

  const handleSelecionarDia = (mes, dia) => {
    setDiaSelecionado({ mes, dia });
    
    if (agendaMedico && agendaMedico[mes] && agendaMedico[mes][dia]) {
      const horarios = agendaMedico[mes][dia];
      const horariosArray = Object.entries(horarios).map(([hora, dados]) => ({
        hora,
        ...dados
      }));
      setHorariosDia(horariosArray);
    } else {
      setHorariosDia([]);
    }
  };

  const toggleExpandirConsulta = (idConsulta) => {
    setExpandidoConsulta(prev => ({
      ...prev,
      [idConsulta]: !prev[idConsulta]
    }));
  };

  const toggleExpandirConsultas = () => {
    setExpandidoConsultas(!expandidoConsultas);
  };

  const toggleExpandirExames = () => {
    setExpandidoExames(!expandidoExames);
  };

  const getStatusConsulta = (data, horario) => {
    const hoje = new Date();
    const dataConsulta = new Date(`${data} ${horario}`);
    return dataConsulta > hoje ? 'agendada' : 'realizada';
  };

  const especialidades = ['Cardiologia', 'Dermatologia', 'Pediatria', 'Neurologia', 'Ortopedia'];

  return (
    <div className="home-atendente">
      <header className="header-atendente">
        <h1>Clínica Médica</h1>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <button onClick={() => navigate('/profile')} className="profile-btn">
            Perfil
          </button>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      <main className="main-atendente">
        <p className="title">
          Atendimento
        </p>
        
        {/* Buscar Paciente por CPF */}
        <section className="secao-busca-paciente">
          <h2 className="titulo-secao">
            <FaSearch /> Buscar Paciente por CPF
          </h2>
          
          <div className="container-busca">
            <div className="input-group">
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscarPaciente()}
              />
              <button onClick={handleBuscarPaciente} className="btn-buscar btn-pequeno">
                Buscar
              </button>
            </div>
          </div>

          {/* Resultado da Busca */}
          {pacienteEncontrado && (
            <div className="resultado-paciente">
              <div className="dados-container">
                <div className="dados-paciente">
                  <h3>Dados do Paciente</h3>
                  <div className="info-coluna">
                    <p><strong>Nome:</strong> {pacienteEncontrado.nomeCompleto}</p>
                    <p><strong>CPF:</strong> {pacienteEncontrado.cpf}</p>
                    <p><strong>Nascimento:</strong> {pacienteEncontrado.nascimento}</p>
                    <p><strong>Email:</strong> {pacienteEncontrado.email}</p>
                    <p><strong>Celular:</strong> {pacienteEncontrado.celular}</p>
                    <p><strong>Endereço:</strong> {pacienteEncontrado.endereco}</p>
                  </div>
                  
                  {/* Convênios dentro do mesmo container */}
                  <div className="convenios-paciente">
                    <h4>Convênios</h4>
                    {convenios.map((conv, idx) => (
                      <div key={idx} className="convenio-item">
                        <p><strong>{conv.nome}</strong></p>
                        <p>Carteirinha: {conv.carteirinha}</p>
                        <p>Validade: {conv.validade}</p>
                      </div>
                    ))}
                  </div>

                  {/* Histórico do Paciente */}
                  {dadosAdicionais && (
                    <div className="historico-paciente">
                      <h4>Histórico Médico</h4>
                      <p>{dadosAdicionais.historico}</p>
                      {dadosAdicionais.medicamentos && dadosAdicionais.medicamentos.length > 0 && (
                        <>
                          <h5>Medicamentos em Uso:</h5>
                          <ul>
                            {dadosAdicionais.medicamentos.map((med, idx) => (
                              <li key={idx}>{med}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      <p><strong>Tipo Sanguíneo:</strong> {dadosAdicionais.tipoSanguineo}</p>
                      <p><strong>Contato de Emergência:</strong> {dadosAdicionais.contatoEmergencia?.nomeCompleto} - {dadosAdicionais.contatoEmergencia?.celular}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Consultas - Expandível */}
              <div className="consultas-container">
                <div className="consultas-header" onClick={toggleExpandirConsultas}>
                  <h3>
                    <FaHistory /> Consultas
                  </h3>
                  {expandidoConsultas ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                
                {expandidoConsultas && (
                  <div className="consultas-anteriores">
                    {consultasPaciente.length > 0 ? (
                      consultasPaciente.map((consulta) => {
                        const status = getStatusConsulta(consulta.data, consulta.horario);
                        return (
                          <div key={consulta.idConsulta} className="consulta-item">
                            <div className="consulta-header" onClick={() => toggleExpandirConsulta(consulta.idConsulta)}>
                              <div>
                                <p><strong>{consulta.data}</strong> - {consulta.horario}</p>
                                <p>{consulta.nomeMedico} - {consulta.especialidade}</p>
                                <p>Status: <span className={`status ${status}`}>
                                  {status === 'agendada' ? 'Agendada' : 'Realizada'}
                                </span></p>
                              </div>
                              {expandidoConsulta[consulta.idConsulta] ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            
                            {expandidoConsulta[consulta.idConsulta] && consulta.registro && (
                              <div className="consulta-detalhes">
                                <div className="detalhes-item">
                                  <h5><FaPrescription /> Medicamentos Prescritos:</h5>
                                  <ul>
                                    {consulta.registro.medicamentosSolicitados?.map((med, idx) => (
                                      <li key={idx}>{med}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="detalhes-item">
                                  <h5><FaFlask /> Exames Solicitados:</h5>
                                  <ul>
                                    {consulta.registro.examesSolicitados?.map((exam, idx) => (
                                      <li key={idx}>{exam}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="detalhes-item">
                                  <h5><FaFileMedical /> Observações Médicas:</h5>
                                  <p>{consulta.registro.observacoesMedicas}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="sem-dados">Nenhuma consulta encontrada</p>
                    )}
                  </div>
                )}
              </div>

              {/* Exames - Expandível */}
              <div className="exames-container">
                <div className="exames-header" onClick={toggleExpandirExames}>
                  <h3>
                    <FaFlask /> Exames
                  </h3>
                  {expandidoExames ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                
                {expandidoExames && (
                  <div className="exames-content">
                    <div className="exames-agendados">
                      <h4>Exames Agendados</h4>
                      <p className="sem-dados">Nenhum exame agendado</p>
                    </div>
                    
                    <div className="exames-realizados">
                      <h4>Exames Realizados</h4>
                      <p className="sem-dados">Nenhum exame realizado</p>
                    </div>
                    
                    <div className="resultados-exames">
                      <h4>Resultados</h4>
                      <p className="sem-dados">Nenhum resultado disponível</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Resto do código permanece igual */}
        <section className="secao-agendar">
          <h2 className="titulo-secao">
            <FaCalendarAlt /> Inserir Consulta / Agenda Médico
          </h2>
          
          <div className="container-busca-medico">
            <div className="busca-medico-form">
              <div className="input-group">
                <label>Especialidade:</label>
                <select
                  value={buscaMedico.especialidade}
                  onChange={(e) => setBuscaMedico({ ...buscaMedico, especialidade: e.target.value })}
                >
                  <option value="">Selecione uma especialidade</option>
                  {especialidades.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>

              <div className="ou-divider">ou</div>

              <div className="input-group">
                <label>Nome do Médico:</label>
                <input
                  type="text"
                  placeholder="Digite o nome do médico"
                  value={buscaMedico.nome}
                  onChange={(e) => setBuscaMedico({ ...buscaMedico, nome: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscarMedicos()}
                />
              </div>

              <button onClick={handleBuscarMedicos} className="btn-buscar">
                Buscar Médico
              </button>
            </div>

            {/* Informações do Médico */}
            {medicoSelecionado && (
              <div className="info-medico">
                <h3>Médico Selecionado</h3>
                <div className="medico-dados">
                  <p><strong>{medicoSelecionado.nomeCompleto}</strong></p>
                  <p>CRM: {medicoSelecionado.crm}</p>
                  <p>Especialidades: {medicoSelecionado.especialidades?.join(', ')}</p>
                  <p>Contato: {medicoSelecionado.celular}</p>
                </div>

                {/* Convênios Aceitos */}
                <div className="convenios-aceitos">
                  <h4>Convênios Aceitos:</h4>
                  <div className="convenios-list">
                    {conveniosMedico.map(conv => (
                      <span key={conv.idConv} className="convenio-badge">{conv.nome}</span>
                    ))}
                  </div>
                </div>

                {/* Agenda Mensal */}
                {agendaMedico && (
                  <div className="agenda-medico">
                    <h4>Agenda - Janeiro 2025</h4>
                    <div className="calendario">
                      {Object.entries(agendaMedico['2025-01'] || {}).map(([dia, horarios]) => (
                        <div
                          key={dia}
                          className={`dia-calendario ${diaSelecionado?.dia === dia ? 'selecionado' : ''}`}
                          onClick={() => handleSelecionarDia('2025-01', dia)}
                        >
                          <span className="numero-dia">{dia}</span>
                        </div>
                      ))}
                    </div>

                    {/* Horários do Dia Selecionado */}
                    {diaSelecionado && (
                      <div className="horarios-dia">
                        <h4>Horários disponíveis - {diaSelecionado.dia}/01/2025</h4>
                        <div className="lista-horarios">
                          {horariosdia.map(horario => (
                            <div
                              key={horario.hora}
                              className={`horario-item ${horario.disponivel ? 'disponivel' : 'ocupado'}`}
                            >
                              <span className="hora">{horario.hora}</span>
                              <span className="status-horario">
                                {horario.disponivel ? 'Disponível' : 'Ocupado'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeAtendente;