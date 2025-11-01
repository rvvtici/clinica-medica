import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, update, get, push, remove } from 'firebase/database';
import { database } from '../Firebase/firebaseConfig';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import './EditarPerfil.css';
import HeaderAtendente from "./HeaderAtendente";
import { useAuth } from '../Auth/AuthContext';

const EditarPerfil = () => {
    const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { paciente, dadosAdicionais } = location.state || {};

  const [formData, setFormData] = useState({
    // Dados Paciente
    nomeCompleto: '',
    email: '',
    celular: '',
    endereco: '',
    nascimento: '',
    idFamilia: '',
    // Dados Adicionais
    historico: '',
    medicamentos: [],
    tipoSanguineo: '',
    contatoEmergenciaNome: '',
    contatoEmergenciaCelular: ''
  });

  const [convenios, setConvenios] = useState([]);
  const [familia, setFamilia] = useState([]);
  const [todosConvenios, setTodosConvenios] = useState({});
  const [novoMedicamento, setNovoMedicamento] = useState('');
  
  // Estados para novo convênio
  const [novoConvenio, setNovoConvenio] = useState({
    idConv: '',
    carteirinha: '',
    validade: ''
  });

  // Estado para adicionar membro da família
  const [cpfNovoMembro, setCpfNovoMembro] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      if (paciente) {
        const cpfNumerico = paciente.cpf.replace(/\D/g, '');

        // Carregar todos os convênios disponíveis
        const convClinicaRef = ref(database, 'convenioClinica');
        const convClinicaSnap = await get(convClinicaRef);
        
        if (convClinicaSnap.exists()) {
          setTodosConvenios(convClinicaSnap.val());
        }

        // Carregar convênios do paciente
        const convPacienteRef = ref(database, 'convenioPaciente');
        const convPacienteSnap = await get(convPacienteRef);

        if (convPacienteSnap.exists()) {
          const dadosConvPaciente = convPacienteSnap.val();
          const conveniosPaciente = Object.entries(dadosConvPaciente)
            .filter(([key, conv]) => conv.cpf === cpfNumerico)
            .map(([key, conv]) => {
              const convInfo = convClinicaSnap.exists() 
                ? convClinicaSnap.val()[conv.idConv]
                : null;
              return {
                chave: key,
                carteirinha: conv.carteirinha,
                idConv: conv.idConv,
                nomeConvenio: convInfo?.nome || 'Desconhecido',
                validade: conv.validade
              };
            });
          setConvenios(conveniosPaciente);
        }

        // Carregar família
        const familiaRef = ref(database, 'familia');
        const familiaSnap = await get(familiaRef);
        
        if (familiaSnap.exists() && paciente.idFamilia) {
          const dadosFamilia = familiaSnap.val();
          const membrosFamilia = dadosFamilia[paciente.idFamilia]?.membros || [];
          
          // Buscar dados dos membros
          const pacientesRef = ref(database, 'paciente');
          const pacientesSnap = await get(pacientesRef);
          
          if (pacientesSnap.exists()) {
            const dadosPacientes = pacientesSnap.val();
            const membrosDetalhados = membrosFamilia
              .filter(cpf => cpf !== cpfNumerico)
              .map(cpf => ({
                ...dadosPacientes[cpf],
                cpfNumerico: cpf
              }))
              .filter(m => m.nomeCompleto);
            setFamilia(membrosDetalhados);
          }
        }

        // Preencher formulário
        setFormData({
          nomeCompleto: paciente.nomeCompleto || '',
          email: paciente.email || '',
          celular: paciente.celular || '',
          endereco: paciente.endereco || '',
          nascimento: paciente.nascimento || '',
          idFamilia: paciente.idFamilia || '',
          historico: dadosAdicionais?.historico || '',
          medicamentos: dadosAdicionais?.medicamentos || [],
          tipoSanguineo: dadosAdicionais?.tipoSanguineo || '',
          contatoEmergenciaNome: dadosAdicionais?.contatoEmergencia?.nomeCompleto || '',
          contatoEmergenciaCelular: dadosAdicionais?.contatoEmergencia?.celular || ''
        });
      }
    };

    carregarDados();
  }, [paciente, dadosAdicionais]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdicionarMedicamento = () => {
    if (novoMedicamento.trim()) {
      setFormData(prev => ({
        ...prev,
        medicamentos: [...prev.medicamentos, novoMedicamento.trim()]
      }));
      setNovoMedicamento('');
    }
  };

  const handleRemoverMedicamento = (index) => {
    setFormData(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((_, idx) => idx !== index)
    }));
  };

  const handleAdicionarConvenio = async () => {
    if (!novoConvenio.idConv || !novoConvenio.carteirinha || !novoConvenio.validade) {
      alert('Por favor, preencha todos os campos do convênio');
      return;
    }

    const cpfNumerico = paciente.cpf.replace(/\D/g, '');
    
    try {
      const convPacienteRef = ref(database, 'convenioPaciente');
      const novaChave = push(convPacienteRef).key;
      
      const novoConvData = {
        carteirinha: novoConvenio.carteirinha,
        idConv: novoConvenio.idConv,
        cpf: cpfNumerico,
        validade: novoConvenio.validade
      };

      await update(ref(database, `convenioPaciente/${novaChave}`), novoConvData);

      const convInfo = todosConvenios[novoConvenio.idConv];
      setConvenios([...convenios, {
        chave: novaChave,
        ...novoConvData,
        nomeConvenio: convInfo?.nome || 'Desconhecido'
      }]);

      setNovoConvenio({ idConv: '', carteirinha: '', validade: '' });
      alert('Convênio adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar convênio:', error);
      alert('Erro ao adicionar convênio');
    }
  };

  const handleRemoverConvenio = async (chave, index) => {
    if (!window.confirm('Deseja realmente remover este convênio?')) {
      return;
    }

    try {
      await remove(ref(database, `convenioPaciente/${chave}`));
      setConvenios(convenios.filter((_, idx) => idx !== index));
      alert('Convênio removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover convênio:', error);
      alert('Erro ao remover convênio');
    }
  };

  const handleAdicionarMembroFamilia = async () => {
    const cpfLimpo = cpfNovoMembro.replace(/\D/g, '');
    
    if (!cpfLimpo) {
      alert('Por favor, digite um CPF válido');
      return;
    }

    const cpfPacienteAtual = paciente.cpf.replace(/\D/g, '');
    
    if (cpfLimpo === cpfPacienteAtual) {
      alert('Não é possível adicionar o próprio paciente como membro da família');
      return;
    }

    try {
      // Verificar se o paciente existe
      const pacienteRef = ref(database, `paciente/${cpfLimpo}`);
      const pacienteSnap = await get(pacienteRef);
      
      if (!pacienteSnap.exists()) {
        alert('Paciente com este CPF não encontrado');
        return;
      }

      const novoPaciente = pacienteSnap.val();

      // Se não tem família, criar uma nova
      if (!formData.idFamilia) {
        const familiaRef = ref(database, 'familia');
        const familiaSnap = await get(familiaRef);
        
        // Gerar novo ID de família
        const familiasExistentes = familiaSnap.exists() ? Object.keys(familiaSnap.val()) : [];
        const numeroMaior = familiasExistentes.length > 0 
          ? Math.max(...familiasExistentes.map(id => parseInt(id.replace('FAM', '')))) 
          : 0;
        const novoIdFamilia = `FAM${String(numeroMaior + 1).padStart(3, '0')}`;

        // Criar nova família com paciente atual e novo membro
        await update(ref(database, `familia/${novoIdFamilia}`), {
          idFamilia: novoIdFamilia,
          membros: [cpfPacienteAtual, cpfLimpo]
        });

        // Atualizar idFamilia dos dois pacientes
        await update(ref(database, `paciente/${cpfPacienteAtual}`), { idFamilia: novoIdFamilia });
        await update(ref(database, `paciente/${cpfLimpo}`), { idFamilia: novoIdFamilia });

        setFormData(prev => ({ ...prev, idFamilia: novoIdFamilia }));
      } else {
        // Verificar se já está na família
        const familiaRef = ref(database, `familia/${formData.idFamilia}`);
        const familiaSnap = await get(familiaRef);
        
        if (familiaSnap.exists()) {
          const membros = familiaSnap.val().membros || [];
          
          if (membros.includes(cpfLimpo)) {
            alert('Este paciente já está na família');
            return;
          }

          // Adicionar membro à família
          const novosMembros = [...membros, cpfLimpo];
          await update(ref(database, `familia/${formData.idFamilia}`), {
            membros: novosMembros
          });

          // Atualizar idFamilia do novo membro
          await update(ref(database, `paciente/${cpfLimpo}`), { 
            idFamilia: formData.idFamilia 
          });
        }
      }

      // Adicionar à lista de exibição
      setFamilia([...familia, {
        ...novoPaciente,
        cpfNumerico: cpfLimpo
      }]);

      setCpfNovoMembro('');
      alert('Membro adicionado à família com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      alert('Erro ao adicionar membro à família');
    }
  };

  const handleRemoverMembroFamilia = async (cpfMembro, index) => {
    if (!window.confirm('Deseja realmente remover este membro da família?')) {
      return;
    }

    try {
      const familiaRef = ref(database, `familia/${formData.idFamilia}`);
      const familiaSnap = await get(familiaRef);
      
      if (familiaSnap.exists()) {
        const membros = familiaSnap.val().membros || [];
        const novosMembros = membros.filter(cpf => cpf !== cpfMembro);

        await update(ref(database, `familia/${formData.idFamilia}`), {
          membros: novosMembros
        });

        // Remover idFamilia do paciente removido
        await update(ref(database, `paciente/${cpfMembro}`), { 
          idFamilia: '' 
        });

        setFamilia(familia.filter((_, idx) => idx !== index));
        alert('Membro removido da família com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      alert('Erro ao remover membro da família');
    }
  };

const handleSalvar = async () => {
  if (!paciente) {
    alert('Erro: Paciente não encontrado');
    return;
  }

  try {
    const cpfNumerico = paciente.cpf.replace(/\D/g, '');

    // Atualiza dados básicos do paciente
    const dadosPacienteAtualizados = {
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      celular: formData.celular,
      endereco: formData.endereco,
      nascimento: formData.nascimento,
      idFamilia: formData.idFamilia
    };

    await update(ref(database, `paciente/${cpfNumerico}`), dadosPacienteAtualizados);

    // Atualiza dados adicionais
    const dadosAdicionaisAtualizados = {
      cpf: cpfNumerico,
      historico: formData.historico,
      medicamentos: formData.medicamentos,
      tipoSanguineo: formData.tipoSanguineo,
      contatoEmergencia: {
        nomeCompleto: formData.contatoEmergenciaNome,
        celular: formData.contatoEmergenciaCelular
      }
    };

    await update(ref(database, `dadosAdicionaisPaciente/${cpfNumerico}`), dadosAdicionaisAtualizados);

    // ADICIONAR ESTAS LINHAS (após as atualizações, antes do alert):
    const idLog = `LOG${Date.now()}`;
    await update(ref(database, `logAcoes/${idLog}`), {
      idLog,
      cpfResponsavel: user?.uid || '11122233344',
      acao: 'Edição de perfil de paciente',
      timestamp: new Date().toISOString(),
      idAfetado: cpfNumerico
    });

    alert('Perfil atualizado com sucesso!');
    navigate('/home-atendente');

  } catch (error) {
    console.error('Erro ao salvar:', error);
    alert('Erro ao salvar alterações');
  }
};

  if (!paciente) {
    return (
      <div className="editar-perfil-container">
        <HeaderAtendente />
        <div className="error-message">
          <p>Nenhum paciente selecionado.</p>
          <button onClick={() => navigate('/home-atendente')} className="btn-voltar">
            <FaArrowLeft /> Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-perfil-container">
      <HeaderAtendente />
      
      <main className="main-editar-perfil">
        <div className="header-editar">
          <button onClick={() => navigate('/home-atendente')} className="btn-voltar">
            <FaArrowLeft /> Voltar
          </button>
          <h1>Editar Perfil</h1>
          <button onClick={handleSalvar} className="btn-salvar">
            <FaSave /> Salvar Alterações
          </button>
        </div>

        <div className="form-editar-perfil">
          {/* Container: Dados do Paciente */}
          <section className="container-section">
            <h3 className="section-title">Dados do Paciente</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>CPF</label>
                <input
                  type="text"
                  value={paciente.cpf}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Data de Nascimento *</label>
                <input
                  type="text"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={handleChange}
                  placeholder="DD/MM/AAAA"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Celular *</label>
                <input
                  type="text"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Endereço *</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Container: Convênios */}
          <section className="container-section">
            <h3 className="section-title">Convênios</h3>
            
            {/* Lista de convênios existentes */}
            <div className="lista-items">
              {convenios.length > 0 ? (
                convenios.map((conv, idx) => (
                  <div key={idx} className="item-row-editable">
                    <div className="item-info">
                      <span className="item-label">{conv.nomeConvenio}</span>
                      <span className="item-detail">Carteirinha: {conv.carteirinha}</span>
                      <span className="item-detail">Validade: {conv.validade}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoverConvenio(conv.chave, idx)}
                      className="btn-remover-item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p className="sem-dados-inline">Nenhum convênio cadastrado</p>
              )}

              {/* Formulário inline para adicionar */}
              <div className="adicionar-item-inline">
                <div className="form-inline">
                  <select
                    value={novoConvenio.idConv}
                    onChange={(e) => setNovoConvenio({...novoConvenio, idConv: e.target.value})}
                    className="input-inline"
                  >
                    <option value="">Selecione um convênio</option>
                    {Object.entries(todosConvenios).map(([id, conv]) => (
                      <option key={id} value={id}>{conv.nome}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={novoConvenio.carteirinha}
                    onChange={(e) => setNovoConvenio({...novoConvenio, carteirinha: e.target.value})}
                    placeholder="Carteirinha"
                    className="input-inline"
                  />

                  <input
                    type="text"
                    value={novoConvenio.validade}
                    onChange={(e) => setNovoConvenio({...novoConvenio, validade: e.target.value})}
                    placeholder="Validade (DD/MM/AAAA)"
                    className="input-inline"
                  />

                  <button type="button" onClick={handleAdicionarConvenio} className="btn-adicionar-inline">
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Container: Família */}
          <section className="container-section">
            <h3 className="section-title">Família</h3>
            
            <div className="lista-items">
              {familia.length > 0 ? (
                familia.map((membro, idx) => (
                  <div key={idx} className="item-row-editable">
                    <div className="item-info-familia">
                      <span className="item-label">{membro.nomeCompleto}</span>
                      <span className="item-detail">CPF: {membro.cpf}</span>
                      <span className="item-detail">Email: {membro.email}</span>
                      <span className="item-detail">Nascimento: {membro.nascimento}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoverMembroFamilia(membro.cpfNumerico, idx)}
                      className="btn-remover-item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p className="sem-dados-inline">Nenhum membro adicional na família</p>
              )}

              {/* Formulário inline para adicionar */}
              <div className="adicionar-item-inline">
                <div className="form-inline">
                  <input
                    type="text"
                    value={cpfNovoMembro}
                    onChange={(e) => setCpfNovoMembro(e.target.value)}
                    placeholder="CPF do membro (000.000.000-00)"
                    className="input-inline-full"
                  />

                  <button type="button" onClick={handleAdicionarMembroFamilia} className="btn-adicionar-inline">
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Container: Dados Adicionais */}
          <section className="container-section">
            <h3 className="section-title">Dados Adicionais</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Tipo Sanguíneo</label>
                <select
                  name="tipoSanguineo"
                  value={formData.tipoSanguineo}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Histórico de Saúde</label>
              <textarea
                name="historico"
                value={formData.historico}
                onChange={handleChange}
                rows="4"
                placeholder="Descreva o histórico médico do paciente, alergias, cirurgias anteriores, etc."
              />
            </div>

            <div className="form-group full-width">
              <label>Medicamentos em Uso</label>
              <div className="medicamentos-input">
                <input
                  type="text"
                  value={novoMedicamento}
                  onChange={(e) => setNovoMedicamento(e.target.value)}
                  placeholder="Digite o nome do medicamento"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdicionarMedicamento()}
                />
                <button type="button" onClick={handleAdicionarMedicamento} className="btn-adicionar">
                  Adicionar
                </button>
              </div>
              
              {formData.medicamentos.length > 0 && (
                <div className="lista-medicamentos">
                  {formData.medicamentos.map((med, idx) => (
                    <div key={idx} className="medicamento-item">
                      <span>{med}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoverMedicamento(idx)}
                        className="btn-remover"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="subsection-title">Contato de Emergência</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="contatoEmergenciaNome"
                  value={formData.contatoEmergenciaNome}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Celular</label>
                <input
                  type="text"
                  name="contatoEmergenciaCelular"
                  value={formData.contatoEmergenciaCelular}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </section>

          {/* Botões de Ação */}
          <div className="form-actions-bottom">
            <button onClick={() => navigate('/home-atendente')} className="btn-cancelar-form">
              Cancelar
            </button>
            <button onClick={handleSalvar} className="btn-salvar-form">
              <FaSave /> Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditarPerfil;