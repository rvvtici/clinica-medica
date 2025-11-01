import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { ref, get, set, update } from 'firebase/database';
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
  const [familiaPaciente, setFamiliaPaciente] = useState([]);
  const [consultasPaciente, setConsultasPaciente] = useState([]);
  const [examesPaciente, setExamesPaciente] = useState([]);
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
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [horariosdia, setHorariosDia] = useState([]);
  const [formAgendamento, setFormAgendamento] = useState({
    cpfPaciente: '',
    especialidade: '',
    tipo: 'consulta',
    local: 'presencial',
    queixas: ''  // NOVA LINHA
  });


    // Adicione estas funções/variáveis após os useState
  const obterMesAnoAtual = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  };

  const [formAgendamentoExame, setFormAgendamentoExame] = useState({
    cpfPaciente: '',
    tipoExame: '',
    data: '',
    queixas: ''
  });
  const [tiposExames, setTiposExames] = useState([]);

  // Linha ~58 - NOVO useEffect para carregar tipos de exames:
  React.useEffect(() => {
    const carregarTiposExames = async () => {
      try {
        const examesRef = ref(database, 'examesTipo');
        const examesSnapshot = await get(examesRef);
        if (examesSnapshot.exists()) {
          const exames = Object.values(examesSnapshot.val());
          setTiposExames(exames);
        }
      } catch (error) {
        console.error('Erro ao carregar tipos de exames:', error);
      }
    };
    carregarTiposExames();
  }, []);

  const obterNomeMesAno = () => {
    const hoje = new Date();
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[hoje.getMonth()]} ${hoje.getFullYear()}`;
  };

  const mesAnoAtual = obterMesAnoAtual(); // Ex: "2025-10"

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
      
      // Busca família do paciente
      if (dadosPaciente.idFamilia) {
        const familiaRef = ref(database, `familia/${dadosPaciente.idFamilia}`);
        const familiaSnapshot = await get(familiaRef);
        if (familiaSnapshot.exists()) {
          const familiaCpfs = familiaSnapshot.val().membros;
          const membrosPromises = familiaCpfs.map(async (cpf) => {
            const membroRef = ref(database, `paciente/${cpf}`);
            const membroSnapshot = await get(membroRef);
            return membroSnapshot.exists() ? { cpf, ...membroSnapshot.val() } : null;
          });
          const membros = await Promise.all(membrosPromises);
          setFamiliaPaciente(membros.filter(m => m !== null && m.cpf !== cpfFormatado));
        }
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
          cons => cons.cpfPaciente === cpfFormatado && cons.tipo !== 'exame'
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

            // Busca pagamento
            let pagamento = null;
            if (consulta.idPagamento) {
              const pagRef = ref(database, `pagamento/${consulta.idPagamento}`);
              const pagSnapshot = await get(pagRef);
              if (pagSnapshot.exists()) {
                pagamento = pagSnapshot.val();
              }
            }
            
            return {
              ...consulta,
              nomeMedico: medicoSnapshot.exists() ? medicoSnapshot.val().nomeCompleto : 'Desconhecido',
              registro: registroConsulta,
              pagamento: pagamento
            };
          })
        );
        
        setConsultasPaciente(consultasComMedico);
      }

      // Busca exames do paciente
      const examesRef = ref(database, 'consulta');
      const examesSnapshot = await get(examesRef);
      if (examesSnapshot.exists()) {
        const todosExames = examesSnapshot.val();
        const examesPac = Object.values(todosExames).filter(
          exam => exam.cpfPaciente === cpfFormatado && exam.tipo === 'exame'
        );
        setExamesPaciente(examesPac);
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

  const gerarCalendario = (mes) => {
    // Janeiro 2025 começa numa quarta-feira (dia 1)
    const primeiroDia = 3; // 0 = domingo, 3 = quarta
    const diasNoMes = 31;
    const calendario = [];
    
    // Adiciona dias vazios antes do primeiro dia
    for (let i = 0; i < primeiroDia; i++) {
      calendario.push(null);
    }
    
    // Adiciona os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      calendario.push(dia);
    }
    
    return calendario;
  };



const handleSelecionarDia = (mes, dia) => {
  // Verifica se o dia existe na agenda antes de selecionar
  if (!agendaMedico || !agendaMedico[mes] || !agendaMedico[mes][dia]) {
    return; // Não faz nada se o dia não existe na agenda
  }
  
  setDiaSelecionado({ mes, dia });
  setHorarioSelecionado(null);
  
  const horarios = agendaMedico[mes][dia];
  const horariosArray = Object.entries(horarios).map(([hora, dados]) => ({
    hora,
    ...dados
  }));
  setHorariosDia(horariosArray);
};


  const handleSelecionarHorario = (horario) => {
    if (!horario.disponivel) return;
    setHorarioSelecionado(horario);
  };

  const handleAgendarConsulta = async () => {
    if (!horarioSelecionado || !diaSelecionado || !medicoSelecionado) {
      alert('Selecione um horário disponível');
      return;
    }

    const cpfPacienteFormatado = formatarCPF(formAgendamento.cpfPaciente);

    // Verifica se o paciente existe
    const pacienteRef = ref(database, `paciente/${cpfPacienteFormatado}`);
    const pacienteSnapshot = await get(pacienteRef);
    
    if (!pacienteSnapshot.exists()) {
      alert('Paciente não encontrado. Verifique o CPF.');
      return;
    }

    try {
      // Gera IDs
      const idConsulta = `CONS${Date.now()}`;
      const idPagamento = `PAG${Date.now()}`;

      // Formata a data
      const [ano, mes] = diaSelecionado.mes.split('-');
      const diaFormatado = String(diaSelecionado.dia).padStart(2, '0');
      const dataFormatada = `${diaFormatado}/${mes}/${ano}`;

      // Cria consulta
      const novaConsulta = {
        idConsulta,
        cpfPaciente: cpfPacienteFormatado,
        cpfMedico: medicoSelecionado.cpfNumerico,
        data: dataFormatada,
        horario: horarioSelecionado.hora,
        especialidade: formAgendamento.especialidade || medicoSelecionado.especialidades[0],
        status: 'agendada',
        idPagamento,
        tipo: formAgendamento.tipo,
        local: formAgendamento.local,
        queixas: formAgendamento.queixas
      };

      // Cria pagamento
      const novoPagamento = {
        idPagamento,
        status: 'pendente',
        data: dataFormatada,
        valor: formAgendamento.tipo === 'retorno' ? 180.00 : 250.00
      };

      // Salva consulta
      await set(ref(database, `consulta/${idConsulta}`), novaConsulta);

      // Salva pagamento
      await set(ref(database, `pagamento/${idPagamento}`), novoPagamento);

      // Atualiza agenda
      const agendaPath = `agenda/${medicoSelecionado.idAgenda}/${diaSelecionado.mes}/${diaSelecionado.dia}/${horarioSelecionado.hora}`;
      await update(ref(database, agendaPath), {
        disponivel: false,
        idConsulta: idConsulta
      });

      // Log da ação
      const idLog = `LOG${Date.now()}`;
      await set(ref(database, `logAcoes/${idLog}`), {
        idLog,
        cpfResponsavel: user.uid || '11122233344',
        acao: 'Agendamento de consulta',
        timestamp: new Date().toISOString(),
        idAfetado: idConsulta
      });

      alert('Consulta agendada com sucesso!');
      
      // Limpa formulário
      setHorarioSelecionado(null);
      setFormAgendamento({
        cpfPaciente: '',
        especialidade: '',
        tipo: 'consulta',
        local: 'presencial',
        queixas: ''
      });

      // Recarrega agenda
      const agendaRef = ref(database, `agenda/${medicoSelecionado.idAgenda}`);
      const agendaSnapshot = await get(agendaRef);
      if (agendaSnapshot.exists()) {
        setAgendaMedico(agendaSnapshot.val());
        handleSelecionarDia(diaSelecionado.mes, diaSelecionado.dia);
      }

    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      alert('Erro ao agendar consulta');
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
    const [dia, mes, ano] = data.split('/');
    const dataConsulta = new Date(`${ano}-${mes}-${dia} ${horario}`);
    return dataConsulta > hoje ? 'agendada' : 'realizada';
  };

  const handleEditarPerfil = () => {
    navigate('/editar-perfil', { state: { paciente: pacienteEncontrado, dadosAdicionais } });
  };

  const handleAgendarExame = async () => {
  const cpfPacienteFormatado = formatarCPF(formAgendamentoExame.cpfPaciente);

  if (!cpfPacienteFormatado || !formAgendamentoExame.tipoExame || !formAgendamentoExame.data) {
    alert('Preencha todos os campos obrigatórios');
    return;
  }

  const pacienteRef = ref(database, `paciente/${cpfPacienteFormatado}`);
  const pacienteSnapshot = await get(pacienteRef);
  
  if (!pacienteSnapshot.exists()) {
    alert('Paciente não encontrado. Verifique o CPF.');
    return;
  }

  try {
    const idExame = `EXAM${Date.now()}`;
    const idPagamento = `PAG${Date.now()}`;

    const [ano, mes, dia] = formAgendamentoExame.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const exameInfo = tiposExames.find(e => e.tipo === formAgendamentoExame.tipoExame);

    const novoExame = {
      idConsulta: idExame,
      cpfPaciente: cpfPacienteFormatado,
      cpfMedico: null,
      data: dataFormatada,
      horario: null,
      especialidade: formAgendamentoExame.tipoExame,
      status: 'agendada',
      idPagamento,
      tipo: 'exame',
      local: 'presencial',
      linkConsulta: null,
      queixas: formAgendamentoExame.queixas || 'Exame agendado'
    };

    const novoPagamento = {
      idPagamento,
      status: 'pendente',
      data: dataFormatada,
      valor: exameInfo ? exameInfo.preco : 0
    };

    await set(ref(database, `consulta/${idExame}`), novoExame);
    await set(ref(database, `pagamento/${idPagamento}`), novoPagamento);

    const idLog = `LOG${Date.now()}`;
    await set(ref(database, `logAcoes/${idLog}`), {
      idLog,
      cpfResponsavel: user.uid || '11122233344',
      acao: 'Agendamento de exame',
      timestamp: new Date().toISOString(),
      idAfetado: idExame
    });

    alert('Exame agendado com sucesso!');
    
    setFormAgendamentoExame({
      cpfPaciente: '',
      tipoExame: '',
      data: '',
      queixas: ''
    });

  } catch (error) {
    console.error('Erro ao agendar exame:', error);
    alert('Erro ao agendar exame');
  }
};

  const especialidades = ['Cardiologia', 'Dermatologia', 'Pediatria', 'Neurologia', 'Ortopedia'];

  return (
    <div className="home-atendente">
      <HeaderAtendente />

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
            <div className="input-group-busca">
              <input
                type="text"
                placeholder="CPF sem traços ou pontos (11 dígitos)"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscarPaciente()}
              />
              <button onClick={handleBuscarPaciente} className="btn-buscar">
                Buscar
              </button>
            </div>
          </div>

          {/* Resultado da Busca */}
          {pacienteEncontrado && (
            <div className="resultado-paciente">
              <div className="dados-paciente">
                <div className="dados-paciente-header">
                  <h3>Dados do Paciente</h3>
                  <button onClick={handleEditarPerfil} className="btn-editar-perfil">
                    <FaEdit /> Editar Perfil
                  </button>
                </div>
                
                <div className="info-grid-duas-colunas">
                  <p><strong>Nome Completo:</strong> {pacienteEncontrado.nomeCompleto}</p>
                  <p><strong>CPF:</strong> {pacienteEncontrado.cpf}</p>
                  <p><strong>Nascimento:</strong> {pacienteEncontrado.nascimento}</p>
                  <p><strong>Email:</strong> {pacienteEncontrado.email}</p>
                  <p><strong>Celular:</strong> {pacienteEncontrado.celular}</p>
                  <p><strong>Endereço:</strong> {pacienteEncontrado.endereco}</p>
                  {dadosAdicionais && (
                    <>
                      <p><strong>Tipo Sanguíneo:</strong> {dadosAdicionais.tipoSanguineo}</p>
                      <p><strong>Contato Emergência:</strong> {dadosAdicionais.contatoEmergencia?.nomeCompleto}: {dadosAdicionais.contatoEmergencia?.celular}</p>
                      {/* <p><strong>Telefone Emergência:</strong> {dadosAdicionais.contatoEmergencia?.celular}</p> */}
                    </>
                  )}
                </div>

                {/* Histórico */}
                {dadosAdicionais && dadosAdicionais.historico && (
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
                  </div>
                )}

                {/* Convênios */}
                <div className="convenios-section">
                  <h4>Convênios</h4>
                  <div className="convenios-list-container">
                    {convenios.length > 0 ? (
                      convenios.map((conv, idx) => (
                        <div key={idx} className="convenio-item">
                          <p><strong>Convênio:</strong> {conv.nome}</p>
                          <p><strong>Carteirinha:</strong> {conv.carteirinha}</p>
                          <p><strong>Validade:</strong> {conv.validade}</p>
                        </div>
                      ))
                    ) : (
                      <p className="sem-dados">Nenhum convênio cadastrado</p>
                    )}
                  </div>

                  {/* Família */}
                  {familiaPaciente.length > 0 && (
                    <>
                      <h4 style={{ marginTop: '20px' }}>Membros da Família</h4>
                      <div className="convenios-list-container">
                        {familiaPaciente.map((membro, idx) => (
                          <div key={idx} className="convenio-item">
                            <p><strong>Nome:</strong> {membro.nomeCompleto}</p>
                            <p><strong>CPF:</strong> {membro.cpf}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Consultas e Exames lado a lado */}
              <div className="consultas-exames-wrapper">
                {/* Consultas */}
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
                          const status = consulta.status || getStatusConsulta(consulta.data, consulta.horario);
                          return (
                            <div key={consulta.idConsulta} className="consulta-item">
                              <div className="consulta-header" onClick={() => toggleExpandirConsulta(consulta.idConsulta)}>
                                <div>
                                  <p><strong>{consulta.data}</strong> - {consulta.horario}</p>
                                  <p>{consulta.nomeMedico} - {consulta.especialidade}</p>
                                  <p>Status: <span className={`status ${status}`}>
                                    {status === 'agendada' ? 'Agendada' : status === 'cancelada' ? 'Cancelada' : 'Realizada'}
                                  </span></p>
                                  {consulta.pagamento && (
                                    <p>Pagamento: <span className={`status ${consulta.pagamento.status}`}>
                                      {consulta.pagamento.status === 'pago' ? 'Pago' : 'Pendente'}
                                    </span></p>
                                  )}
                                </div>
                                {expandidoConsulta[consulta.idConsulta] ? <FaChevronUp /> : <FaChevronDown />}
                              </div>
                              
                              {expandidoConsulta[consulta.idConsulta] && consulta.registro && (
                                <div className="consulta-detalhes">
                                  {consulta.registro.medicamentosSolicitados?.length > 0 && (
                                    <div className="detalhes-item">
                                      <h5><FaPrescription /> Medicamentos Prescritos:</h5>
                                      <ul>
                                        {consulta.registro.medicamentosSolicitados.map((med, idx) => (
                                          <li key={idx}>{med}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {consulta.registro.examesSolicitados?.length > 0 && (
                                    <div className="detalhes-item">
                                      <h5><FaFlask /> Exames Solicitados:</h5>
                                      <ul>
                                        {consulta.registro.examesSolicitados.map((exam, idx) => (
                                          <li key={idx}>{exam}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {consulta.registro.observacoesMedicas && (
                                    <div className="detalhes-item">
                                      <h5><FaFileMedical /> Observações Médicas:</h5>
                                      <p>{consulta.registro.observacoesMedicas}</p>
                                    </div>
                                  )}

                                  {consulta.registro.atestado && (
                                    <div className="detalhes-item">
                                      <h5><FaFileMedical /> Atestado:</h5>
                                      <p>{consulta.registro.atestado}</p>
                                    </div>
                                  )}
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

                {/* Exames */}
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
                        {examesPaciente.filter(e => e.status === 'agendada').length > 0 ? (
                          examesPaciente.filter(e => e.status === 'agendada').map((exame, idx) => (
                            <div key={idx} className="exame-item">
                              <p><strong>{exame.especialidade}</strong></p>
                              <p>{exame.data}</p>
                            </div>
                          ))
                        ) : (
                          <p className="sem-dados">Nenhum exame agendado</p>
                        )}
                      </div>
                      
                      <div className="exames-realizados">
                        <h4>Exames Realizados</h4>
                        {examesPaciente.filter(e => e.status === 'realizada').length > 0 ? (
                          examesPaciente.filter(e => e.status === 'realizada').map((exame, idx) => (
                            <div key={idx} className="exame-item">
                              <p><strong>{exame.especialidade}</strong></p>
                              <p>{exame.data}</p>
                              {exame.resultado && <p>Resultado: {exame.resultado}</p>}
                            </div>
                          ))
                        ) : (
                          <p className="sem-dados">Nenhum exame realizado</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Inserir Consulta / Agenda Médico */}
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

{agendaMedico && (
  <div className="agenda-medico">
    <div className="agenda-header">
      <h4>Agenda - {obterNomeMesAno()}</h4>
    </div>
    <div className="calendario-mes">
      <div className="dias-semana">
        <div className="dia-semana-label">Dom</div>
        <div className="dia-semana-label">Seg</div>
        <div className="dia-semana-label">Ter</div>
        <div className="dia-semana-label">Qua</div>
        <div className="dia-semana-label">Qui</div>
        <div className="dia-semana-label">Sex</div>
        <div className="dia-semana-label">Sáb</div>
      </div>
      <div className="calendario">
        {gerarCalendario(mesAnoAtual).map((dia, idx) => {
          const diaExisteNaAgenda = dia && agendaMedico && agendaMedico[mesAnoAtual]?.[dia];
          
          return (
            <div
              key={idx}
              className={`dia-calendario ${dia === null ? 'vazio' : ''} ${!diaExisteNaAgenda && dia !== null ? 'sem-agenda' : ''} ${diaSelecionado?.dia === dia ? 'selecionado' : ''}`}
              onClick={() => diaExisteNaAgenda && handleSelecionarDia(mesAnoAtual, dia)}
              style={{ cursor: diaExisteNaAgenda ? 'pointer' : dia === null ? 'default' : 'not-allowed' }}
            >
              <span className="numero-dia">{dia || ''}</span>
            </div>
          );
        })}
      </div>
    </div>

    {/* Horários do Dia Selecionado */}
    {diaSelecionado && (
      <div className="horarios-dia">
        <h4>Horários disponíveis - {diaSelecionado.dia}/{String(new Date().getMonth() + 1).padStart(2, '0')}/{new Date().getFullYear()}</h4>
        <div className="lista-horarios">
          {horariosdia.map(horario => (
            <div
              key={horario.hora}
              className={`horario-item ${horario.disponivel ? 'disponivel' : 'ocupado'} ${horarioSelecionado?.hora === horario.hora ? 'selecionado' : ''}`}
              onClick={() => handleSelecionarHorario(horario)}
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

    {/* Formulário de Agendamento */}
    {horarioSelecionado && (
      <div className="form-agendar-consulta">
        <h4>Agendar Consulta - {diaSelecionado.dia}/{String(new Date().getMonth() + 1).padStart(2, '0')}/{new Date().getFullYear()} às {horarioSelecionado.hora}</h4>
        
        <div className="form-group">
          <label>CPF do Paciente:</label>
          <input
            type="text"
            placeholder="CPF sem traços ou pontos (11 dígitos)"
            value={formAgendamento.cpfPaciente}
            onChange={(e) => setFormAgendamento({...formAgendamento, cpfPaciente: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Especialidade:</label>
          <select
            value={formAgendamento.especialidade}
            onChange={(e) => setFormAgendamento({...formAgendamento, especialidade: e.target.value})}
          >
            <option value="">Selecione</option>
            {medicoSelecionado.especialidades?.map(esp => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tipo de Consulta:</label>
          <select
            value={formAgendamento.tipo}
            onChange={(e) => setFormAgendamento({...formAgendamento, tipo: e.target.value})}
          >
            <option value="consulta">Consulta Normal</option>
            <option value="retorno">Retorno</option>
          </select>
        </div>

        <div className="form-group">
          <label>Local:</label>
          <select
            value={formAgendamento.local}
            onChange={(e) => setFormAgendamento({...formAgendamento, local: e.target.value})}
          >
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div className="form-group">
          <label>Observações adicionais: </label>
          <textarea
            placeholder="Informações complementares sobre a consulta"
            value={formAgendamento.queixas}
            onChange={(e) => setFormAgendamento({...formAgendamento, queixas: e.target.value})}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button className="btn-confirmar" onClick={handleAgendarConsulta}>
            Confirmar Agendamento
          </button>
          <button className="btn-cancelar" onClick={() => {
            setHorarioSelecionado(null);
            setFormAgendamento({
              cpfPaciente: '',
              especialidade: '',
              tipo: 'consulta',
              local: 'presencial'
            });
          }}>
            Cancelar
          </button>
        </div>
      </div>
    )}
  </div>
)}
              </div>
            )}
          </div>
        </section>


<section className="secao-agendar">
  <h2 className="titulo-secao">
    <FaFlask /> Agendar Exame
  </h2>
  
  <div className="form-agendar-exame">
    <div className="form-group">
      <label>CPF do Paciente: *</label>
      <input
        type="text"
        placeholder="CPF sem traços ou pontos (11 dígitos)"
        value={formAgendamentoExame.cpfPaciente}
        onChange={(e) => setFormAgendamentoExame({...formAgendamentoExame, cpfPaciente: e.target.value})}
      />
    </div>

    <div className="form-group">
      <label>Tipo de Exame: *</label>
      <select
        value={formAgendamentoExame.tipoExame}
        onChange={(e) => setFormAgendamentoExame({...formAgendamentoExame, tipoExame: e.target.value})}
      >
        <option value="">Selecione o tipo de exame</option>
        {tiposExames.map((exame, idx) => (
          <option key={idx} value={exame.tipo}>
            {exame.tipo} - R$ {exame.preco.toFixed(2)}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Data do Exame: *</label>
      <input
        type="date"
        value={formAgendamentoExame.data}
        onChange={(e) => setFormAgendamentoExame({...formAgendamentoExame, data: e.target.value})}
        min={new Date().toISOString().split('T')[0]}
      />
    </div>

    <div className="form-group">
      <label>Observações adicionais:</label>
      <textarea
        placeholder="Informações complementares sobre o exame"
        value={formAgendamentoExame.queixas}
        onChange={(e) => setFormAgendamentoExame({...formAgendamentoExame, queixas: e.target.value})}
        rows="3"
      />
    </div>

    <button onClick={handleAgendarExame} className="btn-confirmar">
      Confirmar Agendamento de Exame
    </button>
  </div>
</section>
      </main>
    </div>
  );
};

export default HomeAtendente;