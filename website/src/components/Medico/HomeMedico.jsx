import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { ref, get, set, update } from 'firebase/database';
import { database } from '../Firebase/firebaseConfig';
import './HomeMedico.css';
import { FaSearch, FaCalendarAlt, FaChevronDown, FaChevronUp, FaFileMedical, FaHistory, FaPrescription, FaFlask, FaNotesMedical, FaVideo, FaClock } from 'react-icons/fa';
import HeaderMedico from "./HeaderMedico";

const HomeMedico = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Função auxiliar para obter mês/ano atual
  const obterMesAnoAtualInicial = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  };

  const [cpfMedico, setCpfMedico] = useState(null);
  const [medicoData, setMedicoData] = useState(null);
  const [agendaMedico, setAgendaMedico] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [consultasDia, setConsultasDia] = useState([]);
  const [proximaConsulta, setProximaConsulta] = useState(null);
  const [expandidoConsulta, setExpandidoConsulta] = useState({});
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState(obterMesAnoAtualInicial());
  
  // Estados para busca de paciente
  const [cpfBusca, setCpfBusca] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [dadosAdicionais, setDadosAdicionais] = useState(null);
  const [consultasPaciente, setConsultasPaciente] = useState([]);
  const [examesPaciente, setExamesPaciente] = useState([]);
  const [expandidoConsultas, setExpandidoConsultas] = useState(false);
  const [expandidoExames, setExpandidoExames] = useState(false);
  const [expandidoConsultaHist, setExpandidoConsultaHist] = useState({});

  // Estados para ações médicas
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [mostrarReceita, setMostrarReceita] = useState(false);
  const [mostrarAtestado, setMostrarAtestado] = useState(false);
  const [mostrarExames, setMostrarExames] = useState(false);
  const [mostrarObservacoes, setMostrarObservacoes] = useState(false);
  const [observacao, setObservacao] = useState('');
  
  const [dadosReceita, setDadosReceita] = useState({
    medicamentos: ['']
  });
  
  const [dadosAtestado, setDadosAtestado] = useState({
    dias: '',
    diagnostico: '',
    observacoes: ''
  });
  
  const [examesSolicitados, setExamesSolicitados] = useState(['']);

  useEffect(() => {
    carregarDadosMedico();
  }, [user]);

  useEffect(() => {
    if (cpfMedico && agendaMedico) {
      buscarProximaConsulta();
    }
  }, [cpfMedico, agendaMedico]);

  const carregarDadosMedico = async () => {
    try {
      if (!user) return;

      const userRef = ref(database, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData || !userData.email) return;

      const medicosRef = ref(database, 'medico');
      const medicosSnapshot = await get(medicosRef);
      const medicos = medicosSnapshot.val();
      
      if (!medicos) return;

      let dadosMedico = null;
      Object.values(medicos).forEach(medico => {
        if (medico.email === userData.email) {
          dadosMedico = medico;
        }
      });

      if (!dadosMedico) {
        console.error('Médico não encontrado para o email:', userData.email);
        return;
      }

      setCpfMedico(dadosMedico.cpfNumerico);
      setMedicoData(dadosMedico);

      // Buscar apenas a agenda específica deste médico
      const agendaRef = ref(database, `agenda/${dadosMedico.idAgenda}`);
      const agendaSnapshot = await get(agendaRef);
      
      if (agendaSnapshot.exists()) {
        const agendaData = agendaSnapshot.val();
        // Verificar se a agenda pertence ao médico correto
        if (agendaData.cpfMedico === dadosMedico.cpfNumerico) {
          setAgendaMedico(agendaData);
        } else {
          console.error('Agenda não pertence ao médico logado');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do médico:', error);
    }
  };

  const buscarProximaConsulta = async () => {
    try {
      const hoje = new Date();
      const dataHoje = formatarDataParaComparacao(hoje);
      const horaAtual = hoje.getHours() * 60 + hoje.getMinutes();

      const consultasRef = ref(database, 'consulta');
      const consultasSnapshot = await get(consultasRef);
      const todasConsultas = consultasSnapshot.val();

      if (!todasConsultas) return;

      let consultasHoje = Object.entries(todasConsultas)
        .filter(([_, consulta]) => {
          return consulta.cpfMedico === cpfMedico && 
                 consulta.data === dataHoje &&
                 consulta.status === 'agendada';
        })
        .map(([id, consulta]) => ({ id, ...consulta }))
        .sort((a, b) => a.horario.localeCompare(b.horario));

      const consultasComDados = await Promise.all(
        consultasHoje.map(async (consulta) => {
          const dadosPaciente = await carregarDadosPacienteCompleto(consulta.cpfPaciente);
          return { ...consulta, paciente: dadosPaciente };
        })
      );

      const proxima = consultasComDados.find(c => {
        if (!c.horario) return false;
        const [hora, min] = c.horario.split(':');
        const minConsulta = parseInt(hora) * 60 + parseInt(min);
        return minConsulta >= horaAtual;
      });

      setProximaConsulta(proxima || null);
    } catch (error) {
      console.error('Erro ao buscar próxima consulta:', error);
    }
  };

  const obterMesAnoAtual = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  };

  const obterNomeMesAno = (mesAno) => {
    const [ano, mes] = mesAno.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  const avancarMes = () => {
    const [ano, mes] = mesAnoSelecionado.split('-');
    const data = new Date(parseInt(ano), parseInt(mes) - 1);
    data.setMonth(data.getMonth() + 1);
    const novoMes = String(data.getMonth() + 1).padStart(2, '0');
    const novoAno = data.getFullYear();
    setMesAnoSelecionado(`${novoAno}-${novoMes}`);
    setDiaSelecionado(null);
    setConsultasDia([]);
  };

  const voltarMes = () => {
    const [ano, mes] = mesAnoSelecionado.split('-');
    const data = new Date(parseInt(ano), parseInt(mes) - 1);
    data.setMonth(data.getMonth() - 1);
    const novoMes = String(data.getMonth() + 1).padStart(2, '0');
    const novoAno = data.getFullYear();
    setMesAnoSelecionado(`${novoAno}-${novoMes}`);
    setDiaSelecionado(null);
    setConsultasDia([]);
  };

  const mesAnoAtual = obterMesAnoAtual();

  const gerarCalendario = (mes) => {
    const [ano, mesNum] = mes.split('-');
    const primeiroDia = new Date(ano, parseInt(mesNum) - 1, 1).getDay();
    const diasNoMes = new Date(ano, parseInt(mesNum), 0).getDate();
    const calendario = [];
    
    for (let i = 0; i < primeiroDia; i++) {
      calendario.push(null);
    }
    
    for (let dia = 1; dia <= diasNoMes; dia++) {
      calendario.push(dia);
    }
    
    return calendario;
  };

const handleSelecionarDia = async (mes, dia) => {
  if (!agendaMedico || !agendaMedico[mes] || !agendaMedico[mes][dia]) {
    return;
  }
  
  setDiaSelecionado({ mes, dia });
  setConsultaSelecionada(null);
  
  try {
    const horarios = agendaMedico[mes][dia];
    const consultasPromises = Object.entries(horarios)
      .filter(([_, dados]) => dados.idConsulta)
      .map(async ([hora, dados]) => {
        const consultaRef = ref(database, `consulta/${dados.idConsulta}`);
        const consultaSnapshot = await get(consultaRef);
        
        if (consultaSnapshot.exists()) {
          const consulta = consultaSnapshot.val();
          
          // VERIFICAR SE A CONSULTA PERTENCE AO MÉDICO LOGADO
          if (consulta.cpfMedico !== cpfMedico) {
            return null;
          }
          
          const dadosPaciente = await carregarDadosPacienteCompleto(consulta.cpfPaciente);
          
          return {
            ...consulta,
            id: dados.idConsulta,
            hora,
            paciente: dadosPaciente
          };
        }
        return null;
      });
    
    const consultasArray = await Promise.all(consultasPromises);
    const consultasFiltradas = consultasArray.filter(c => c !== null);
    consultasFiltradas.sort((a, b) => a.hora.localeCompare(b.hora));
    
    setConsultasDia(consultasFiltradas);
  } catch (error) {
    console.error('Erro ao carregar consultas do dia:', error);
  }
};


  const formatarCPF = (cpf) => {
    return cpf.replace(/\D/g, '');
  };

  const carregarDadosPacienteCompleto = async (cpf) => {
    const cpfFormatado = formatarCPF(cpf);
    
    const pacienteRef = ref(database, `paciente/${cpfFormatado}`);
    const pacienteSnapshot = await get(pacienteRef);
    const paciente = pacienteSnapshot.val();

    const dadosAdRef = ref(database, `dadosAdicionaisPaciente/${cpfFormatado}`);
    const dadosAdSnapshot = await get(dadosAdRef);
    const dadosAd = dadosAdSnapshot.val();

    return {
      ...paciente,
      ...dadosAd
    };
  };

  const handleBuscarPaciente = async () => {
    const cpfFormatado = formatarCPF(cpfBusca);
    
    try {
      const pacienteRef = ref(database, `paciente/${cpfFormatado}`);
      const pacienteSnapshot = await get(pacienteRef);
      
      if (!pacienteSnapshot.exists()) {
        alert('Paciente não encontrado');
        setPacienteEncontrado(null);
        return;
      }
      
      const dadosPaciente = pacienteSnapshot.val();
      setPacienteEncontrado(dadosPaciente);
      
      const dadosAdRef = ref(database, `dadosAdicionaisPaciente/${cpfFormatado}`);
      const dadosAdSnapshot = await get(dadosAdRef);
      if (dadosAdSnapshot.exists()) {
        setDadosAdicionais(dadosAdSnapshot.val());
      }
      
      // Buscar consultas do paciente
      const consultasRef = ref(database, 'consulta');
      const consultasSnapshot = await get(consultasRef);
      if (consultasSnapshot.exists()) {
        const todasConsultas = consultasSnapshot.val();
        const consultasPac = Object.values(todasConsultas).filter(
          cons => cons.cpfPaciente === cpfFormatado && 
                  cons.cpfMedico === cpfMedico && 
                  cons.tipo !== 'exame'
        );
        
const consultasComMedico = await Promise.all(
  consultasPac.map(async (consulta) => {
    const registrosRef = ref(database, 'registroMedico');
            const registrosSnapshot = await get(registrosRef);
            let registroConsulta = null;
            
            if (registrosSnapshot.exists()) {
              const todosRegistros = registrosSnapshot.val();
              registroConsulta = Object.values(todosRegistros).find(
                reg => reg.idConsulta === consulta.idConsulta
              );
            }

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
              nomeMedico: medicoData.nomeCompleto,
              registro: registroConsulta,
              pagamento: pagamento
            };
          })
        );
        
        setConsultasPaciente(consultasComMedico);
      }

      // Buscar exames
      const examesRef = ref(database, 'consulta');
      const examesSnapshot = await get(examesRef);
      if (examesSnapshot.exists()) {
        const todosExames = examesSnapshot.val();
        const examesPac = Object.values(todosExames).filter(
  exam => exam.cpfPaciente === cpfFormatado && 
          exam.cpfMedico === cpfMedico && 
          exam.tipo === 'exame'
);
        setExamesPaciente(examesPac);
      }
      
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      alert('Erro ao buscar paciente');
    }
  };

  const handleGerarReceita = async () => {
    if (!consultaSelecionada) {
      alert('Selecione uma consulta primeiro');
      return;
    }

    const medicamentosFiltrados = dadosReceita.medicamentos.filter(m => m.trim());
    if (medicamentosFiltrados.length === 0) {
      alert('Adicione pelo menos um medicamento');
      return;
    }

    try {
      const registroRef = ref(database, `registroMedico/${consultaSelecionada.id}`);
      const registroSnapshot = await get(registroRef);
      const registroAtual = registroSnapshot.exists() ? registroSnapshot.val() : {};

      await update(registroRef, {
        ...registroAtual,
        idRegistroMedico: consultaSelecionada.id,
        idConsulta: consultaSelecionada.id,
        medicamentosSolicitados: medicamentosFiltrados
      });

      // Log
      const idLog = `LOG${Date.now()}`;
      await set(ref(database, `logAcoes/${idLog}`), {
        idLog,
        cpfResponsavel: cpfMedico,
        acao: 'Receita médica emitida',
        timestamp: new Date().toISOString(),
        idAfetado: consultaSelecionada.id
      });

      alert('Receita médica gerada com sucesso!');
      setMostrarReceita(false);
      setDadosReceita({ medicamentos: [''] });
    } catch (error) {
      console.error('Erro ao gerar receita:', error);
      alert('Erro ao gerar receita');
    }
  };

  const handleGerarAtestado = async () => {
    if (!consultaSelecionada) {
      alert('Selecione uma consulta primeiro');
      return;
    }

    if (!dadosAtestado.dias || !dadosAtestado.diagnostico) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    try {
      const registroRef = ref(database, `registroMedico/${consultaSelecionada.id}`);
      const registroSnapshot = await get(registroRef);
      const registroAtual = registroSnapshot.exists() ? registroSnapshot.val() : {};

      await update(registroRef, {
        ...registroAtual,
        idRegistroMedico: consultaSelecionada.id,
        idConsulta: consultaSelecionada.id,
        atestado: `${dadosAtestado.dias} dias - ${dadosAtestado.diagnostico}${dadosAtestado.observacoes ? ' - ' + dadosAtestado.observacoes : ''}`
      });

      // Log
      const idLog = `LOG${Date.now()}`;
      await set(ref(database, `logAcoes/${idLog}`), {
        idLog,
        cpfResponsavel: cpfMedico,
        acao: 'Atestado médico emitido',
        timestamp: new Date().toISOString(),
        idAfetado: consultaSelecionada.id
      });

      alert('Atestado gerado com sucesso!');
      setMostrarAtestado(false);
      setDadosAtestado({ dias: '', diagnostico: '', observacoes: '' });
    } catch (error) {
      console.error('Erro ao gerar atestado:', error);
      alert('Erro ao gerar atestado');
    }
  };

  const handleAdicionarObservacao = async () => {
    if (!consultaSelecionada) {
      alert('Selecione uma consulta primeiro');
      return;
    }

    if (!observacao.trim()) {
      alert('Digite uma observação');
      return;
    }

    try {
      const registroRef = ref(database, `registroMedico/${consultaSelecionada.id}`);
      const registroSnapshot = await get(registroRef);
      const registroAtual = registroSnapshot.exists() ? registroSnapshot.val() : {};

      await update(registroRef, {
        ...registroAtual,
        idRegistroMedico: consultaSelecionada.id,
        idConsulta: consultaSelecionada.id,
        observacoesMedicas: observacao
      });

      // Log
      const idLog = `LOG${Date.now()}`;
      await set(ref(database, `logAcoes/${idLog}`), {
        idLog,
        cpfResponsavel: cpfMedico,
        acao: 'Observação médica adicionada',
        timestamp: new Date().toISOString(),
        idAfetado: consultaSelecionada.id
      });

      alert('Observação adicionada com sucesso!');
      setMostrarObservacoes(false);
      setObservacao('');
    } catch (error) {
      console.error('Erro ao adicionar observação:', error);
      alert('Erro ao adicionar observação');
    }
  };

  const handleSolicitarExames = async () => {
    if (!consultaSelecionada) {
      alert('Selecione uma consulta primeiro');
      return;
    }

    const examesFiltrados = examesSolicitados.filter(e => e.trim());
    if (examesFiltrados.length === 0) {
      alert('Adicione pelo menos um exame');
      return;
    }

    try {
      const registroRef = ref(database, `registroMedico/${consultaSelecionada.id}`);
      const registroSnapshot = await get(registroRef);
      const registroAtual = registroSnapshot.exists() ? registroSnapshot.val() : {};

      await update(registroRef, {
        ...registroAtual,
        idRegistroMedico: consultaSelecionada.id,
        idConsulta: consultaSelecionada.id,
        examesSolicitados: examesFiltrados
      });

      // Log
      const idLog = `LOG${Date.now()}`;
      await set(ref(database, `logAcoes/${idLog}`), {
        idLog,
        cpfResponsavel: cpfMedico,
        acao: 'Exames solicitados',
        timestamp: new Date().toISOString(),
        idAfetado: consultaSelecionada.id
      });

      alert('Exames solicitados com sucesso!');
      setMostrarExames(false);
      setExamesSolicitados(['']);
    } catch (error) {
      console.error('Erro ao solicitar exames:', error);
      alert('Erro ao solicitar exames');
    }
  };

  const formatarDataParaComparacao = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const toggleExpandirConsulta = (idConsulta) => {
    setExpandidoConsulta(prev => ({
      ...prev,
      [idConsulta]: !prev[idConsulta]
    }));
  };

  const toggleExpandirConsultaHist = (idConsulta) => {
    setExpandidoConsultaHist(prev => ({
      ...prev,
      [idConsulta]: !prev[idConsulta]
    }));
  };

  const getStatusConsulta = (data, horario) => {
    const hoje = new Date();
    const [dia, mes, ano] = data.split('/');
    const dataConsulta = new Date(`${ano}-${mes}-${dia} ${horario}`);
    return dataConsulta > hoje ? 'agendada' : 'realizada';
  };

  return (
    <div className="home-medico">
      <HeaderMedico />

      <main className="main-medico">
        <p className="title">Painel do Médico</p>

        {/* Próxima Consulta */}
        {proximaConsulta && (
          <section className="secao-proxima-consulta">
            <h2 className="titulo-secao">
              <FaClock /> Próxima Consulta
            </h2>
            
            <div className="proxima-consulta-card">
              <div className="paciente-header">
                <div className="paciente-dados">
                  <h4>{proximaConsulta.paciente?.nomeCompleto}</h4>
                  <p><strong>CPF:</strong> {proximaConsulta.paciente?.cpf}</p>
                  <p><strong>Nascimento:</strong> {proximaConsulta.paciente?.nascimento}</p>
                  <p><strong>Tipo Sanguíneo:</strong> {proximaConsulta.paciente?.tipoSanguineo || 'Não informado'}</p>
                  <p><strong>Endereço:</strong> {proximaConsulta.paciente?.endereco}</p>
                  <p><strong>Contato Emergência:</strong> {proximaConsulta.paciente?.contatoEmergencia?.nomeCompleto} - {proximaConsulta.paciente?.contatoEmergencia?.celular}</p>
                </div>
                <div className="consulta-horario">
                  <p><FaCalendarAlt /> <strong>{proximaConsulta.data}</strong></p>
                  <p>às {proximaConsulta.horario}</p>
                  <p><strong>Especialidade:</strong> {proximaConsulta.especialidade}</p>
                  {proximaConsulta.local === 'online' && proximaConsulta.linkConsulta && (
                    <a href={proximaConsulta.linkConsulta} target="_blank" rel="noopener noreferrer" className="btn-acessar-online">
                      <FaVideo /> Acessar Consulta Online
                    </a>
                  )}
                </div>
              </div>

              <div className="detalhes-consulta">
                <div className="info-section">
                  <h5>Queixas do Paciente:</h5>
                  <p>{proximaConsulta.queixas || 'Nenhuma queixa registrada'}</p>
                </div>

                {proximaConsulta.paciente?.historico && (
                  <div className="info-section">
                    <h5>Histórico Médico:</h5>
                    <p>{proximaConsulta.paciente.historico}</p>
                  </div>
                )}

                {proximaConsulta.paciente?.medicamentos?.length > 0 && (
                  <div className="info-section">
                    <h5>Medicamentos em Uso:</h5>
                    <p>{proximaConsulta.paciente.medicamentos.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        
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

          {pacienteEncontrado && (
            <div className="resultado-paciente">
              <div className="dados-paciente">
                <h3>Dados do Paciente</h3>
                
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
                    </>
                  )}
                </div>

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
              </div>

              <div className="consultas-exames-wrapper">
                <div className="consultas-container">
                  <div className="consultas-header" onClick={() => setExpandidoConsultas(!expandidoConsultas)}>
                    <h3><FaHistory /> Consultas</h3>
                    {expandidoConsultas ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  
                  {expandidoConsultas && (
                    <div className="consultas-anteriores">
                      {consultasPaciente.length > 0 ? (
                        consultasPaciente.map((consulta) => {
                          const status = consulta.status || getStatusConsulta(consulta.data, consulta.horario);
                          return (
                            <div key={consulta.idConsulta} className="consulta-item">
                              <div className="consulta-header" onClick={() => toggleExpandirConsultaHist(consulta.idConsulta)}>
                                <div>
                                  <p><strong>{consulta.data}</strong> - {consulta.horario}</p>
                                  <p>{consulta.nomeMedico} - {consulta.especialidade}</p>
                                  <p>Status: <span className={`status ${status}`}>
                                    {status === 'agendada' ? 'Agendada' : status === 'cancelada' ? 'Cancelada' : 'Realizada'}
                                  </span></p>
                                </div>
                                {expandidoConsultaHist[consulta.idConsulta] ? <FaChevronUp /> : <FaChevronDown />}
                              </div>
                              
                              {expandidoConsultaHist[consulta.idConsulta] && consulta.registro && (
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

                <div className="exames-container">
                  <div className="exames-header" onClick={() => setExpandidoExames(!expandidoExames)}>
                    <h3><FaFlask /> Exames</h3>
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

        {/* Agenda Médica */}
        <section className="secao-agenda">
          <h2 className="titulo-secao">
            <FaCalendarAlt /> Agenda Médica
          </h2>
          
          {agendaMedico && (
            <div className="agenda-medico">
              <div className="agenda-header">
                <button onClick={voltarMes} className="btn-nav-mes">
                  ← Mês Anterior
                </button>
                <h4>Agenda - {obterNomeMesAno(mesAnoSelecionado)}</h4>
                <button onClick={avancarMes} className="btn-nav-mes">
                  Próximo Mês →
                </button>
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
                  {gerarCalendario(mesAnoSelecionado).map((dia, idx) => {
                    const diaExisteNaAgenda = dia && agendaMedico && agendaMedico[mesAnoSelecionado]?.[dia];
                    
                    return (
                      <div
                        key={idx}
                        className={`dia-calendario ${dia === null ? 'vazio' : ''} ${!diaExisteNaAgenda && dia !== null ? 'sem-agenda' : ''} ${diaSelecionado?.dia === dia && diaSelecionado?.mes === mesAnoSelecionado ? 'selecionado' : ''}`}
                        onClick={() => diaExisteNaAgenda && handleSelecionarDia(mesAnoSelecionado, dia)}
                        style={{ cursor: diaExisteNaAgenda ? 'pointer' : dia === null ? 'default' : 'not-allowed' }}
                      >
                        <span className="numero-dia">{dia || ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Consultas do Dia Selecionado */}
              {diaSelecionado && consultasDia.length > 0 && (
                <div className="consultas-do-dia">
                  <h4>Consultas do dia {diaSelecionado.dia}/{mesAnoSelecionado.split('-')[1]}/{mesAnoSelecionado.split('-')[0]}</h4>
                  
                  <div className="lista-consultas-dia">
                    {consultasDia.map((consulta) => (
                      <div key={consulta.id} className="consulta-dia-item">
                        <div 
                          className="consulta-dia-header" 
                          onClick={() => toggleExpandirConsulta(consulta.id)}
                        >
                          <div className="consulta-info">
                            <p className="consulta-horario-info"><strong>{consulta.hora}</strong></p>
                            <p className="consulta-paciente-nome">{consulta.paciente?.nomeCompleto}</p>
                            <p className="consulta-especialidade">{consulta.especialidade}</p>
                          </div>
                          {expandidoConsulta[consulta.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </div>

                        {expandidoConsulta[consulta.id] && (
                          <div className="consulta-dia-detalhes">
                            <div className="paciente-info-completa">
                              <div className="info-grid-duas-colunas">
                                <p><strong>CPF:</strong> {consulta.paciente?.cpf}</p>
                                <p><strong>Nascimento:</strong> {consulta.paciente?.nascimento}</p>
                                <p><strong>Tipo Sanguíneo:</strong> {consulta.paciente?.tipoSanguineo || 'Não informado'}</p>
                                <p><strong>Telefone:</strong> {consulta.paciente?.celular}</p>
                                <p><strong>Endereço:</strong> {consulta.paciente?.endereco}</p>
                                <p><strong>Contato Emergência:</strong> {consulta.paciente?.contatoEmergencia?.nomeCompleto} - {consulta.paciente?.contatoEmergencia?.celular}</p>
                              </div>

                              <div className="info-section">
                                <h5>Queixas:</h5>
                                <p>{consulta.queixas || 'Nenhuma queixa registrada'}</p>
                              </div>

                              {consulta.paciente?.historico && (
                                <div className="info-section">
                                  <h5>Histórico Médico:</h5>
                                  <p>{consulta.paciente.historico}</p>
                                </div>
                              )}

                              {consulta.paciente?.medicamentos?.length > 0 && (
                                <div className="info-section">
                                  <h5>Medicamentos em Uso:</h5>
                                  <p>{consulta.paciente.medicamentos.join(', ')}</p>
                                </div>
                              )}
                            </div>

                            {/* Botões de Ação */}
                            <div className="acoes-consulta">
                              <button 
                                className="btn-acao"
                                onClick={() => {
                                  setConsultaSelecionada(consulta);
                                  setMostrarReceita(true);
                                }}
                              >
                                <FaPrescription /> Receita Médica
                              </button>
                              
                              <button 
                                className="btn-acao"
                                onClick={() => {
                                  setConsultaSelecionada(consulta);
                                  setMostrarAtestado(true);
                                }}
                              >
                                <FaNotesMedical /> Atestado Médico
                              </button>
                              
                              <button 
                                className="btn-acao"
                                onClick={() => {
                                  setConsultaSelecionada(consulta);
                                  setMostrarObservacoes(true);
                                }}
                              >
                                <FaFileMedical /> Adicionar Observações
                              </button>
                              
                              <button 
                                className="btn-acao"
                                onClick={() => {
                                  setConsultaSelecionada(consulta);
                                  setMostrarExames(true);
                                }}
                              >
                                <FaFlask /> Solicitar Exames
                              </button>
                            </div>

                            {/* Formulários */}
                            {mostrarReceita && consultaSelecionada?.id === consulta.id && (
                              <div className="form-acao">
                                <h5>Receita Médica</h5>
                                {dadosReceita.medicamentos.map((med, idx) => (
                                  <div key={idx} className="input-field">
                                    <input
                                      type="text"
                                      value={med}
                                      onChange={(e) => {
                                        const novos = [...dadosReceita.medicamentos];
                                        novos[idx] = e.target.value;
                                        setDadosReceita({ medicamentos: novos });
                                      }}
                                      placeholder={`Medicamento ${idx + 1} (ex: AAS 100mg - 1x ao dia)`}
                                    />
                                  </div>
                                ))}
                                <button 
                                  className="btn-adicionar"
                                  onClick={() => setDadosReceita({
                                    medicamentos: [...dadosReceita.medicamentos, '']
                                  })}
                                >
                                  + Adicionar Medicamento
                                </button>
                                <div className="form-actions">
                                  <button className="btn-confirmar" onClick={handleGerarReceita}>
                                    Gerar Receita
                                  </button>
                                  <button className="btn-cancelar" onClick={() => {
                                    setMostrarReceita(false);
                                    setDadosReceita({ medicamentos: [''] });
                                  }}>
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            )}

                            {mostrarAtestado && consultaSelecionada?.id === consulta.id && (
                              <div className="form-acao">
                                <h5>Atestado Médico</h5>
                                <div className="input-field">
                                  <label>Dias de Afastamento: *</label>
                                  <input
                                    type="number"
                                    value={dadosAtestado.dias}
                                    onChange={(e) => setDadosAtestado(prev => ({ ...prev, dias: e.target.value }))}
                                    placeholder="Número de dias"
                                  />
                                </div>
                                <div className="input-field">
                                  <label>Diagnóstico: *</label>
                                  <input
                                    type="text"
                                    value={dadosAtestado.diagnostico}
                                    onChange={(e) => setDadosAtestado(prev => ({ ...prev, diagnostico: e.target.value }))}
                                    placeholder="CID ou diagnóstico"
                                  />
                                </div>
                                <div className="input-field">
                                  <label>Observações:</label>
                                  <textarea
                                    value={dadosAtestado.observacoes}
                                    onChange={(e) => setDadosAtestado(prev => ({ ...prev, observacoes: e.target.value }))}
                                    placeholder="Observações adicionais (opcional)"
                                    rows="3"
                                  />
                                </div>
                                <div className="form-actions">
                                  <button className="btn-confirmar" onClick={handleGerarAtestado}>
                                    Gerar Atestado
                                  </button>
                                  <button className="btn-cancelar" onClick={() => {
                                    setMostrarAtestado(false);
                                    setDadosAtestado({ dias: '', diagnostico: '', observacoes: '' });
                                  }}>
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            )}

                            {mostrarObservacoes && consultaSelecionada?.id === consulta.id && (
                              <div className="form-acao">
                                <h5>Adicionar Observações</h5>
                                <div className="input-field">
                                  <textarea
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    placeholder="Digite suas observações sobre a consulta..."
                                    rows="4"
                                  />
                                </div>
                                <div className="form-actions">
                                  <button className="btn-confirmar" onClick={handleAdicionarObservacao}>
                                    Salvar Observação
                                  </button>
                                  <button className="btn-cancelar" onClick={() => {
                                    setMostrarObservacoes(false);
                                    setObservacao('');
                                  }}>
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            )}

                            {mostrarExames && consultaSelecionada?.id === consulta.id && (
                              <div className="form-acao">
                                <h5>Solicitar Exames</h5>
                                {examesSolicitados.map((exame, idx) => (
                                  <div key={idx} className="input-field">
                                    <input
                                      type="text"
                                      value={exame}
                                      onChange={(e) => {
                                        const novos = [...examesSolicitados];
                                        novos[idx] = e.target.value;
                                        setExamesSolicitados(novos);
                                      }}
                                      placeholder={`Exame ${idx + 1} (ex: Hemograma Completo)`}
                                    />
                                  </div>
                                ))}
                                <button 
                                  className="btn-adicionar"
                                  onClick={() => setExamesSolicitados([...examesSolicitados, ''])}
                                >
                                  + Adicionar Exame
                                </button>
                                <div className="form-actions">
                                  <button className="btn-confirmar" onClick={handleSolicitarExames}>
                                    Solicitar Exames
                                  </button>
                                  <button className="btn-cancelar" onClick={() => {
                                    setMostrarExames(false);
                                    setExamesSolicitados(['']);
                                  }}>
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diaSelecionado && consultasDia.length === 0 && (
                <div className="sem-consultas-dia">
                  <p>Nenhuma consulta agendada para este dia</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomeMedico;