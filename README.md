# clinica-medica

para rodar: cd website & npm install (node.js deve já estar instalado) & npm run dev no terminal. depois, entrar em http://localhost:5173.
para banco de dados: criar um .env e adicionar valores do firebase usando o .env.examplo como base.


#### funcionalidades:
- ambos: login, especialidades médicas, convenios
- atendente: 
    - home: buscar paciente por cpf -> visualizar dados (+ histórico médico) | editar perfil | consultas médicas e respectivos exames | inserir consulta | cancelar consulta | pagamento consulta | visualizar agenda médico
    - editar perfil: dados, histórico médico e convenios do paciente buscado no cpf 
    - perfil: visualizar dados pessoais | horários de trabalho
- médico:
    - home: visualizar agenda | proxima consulta | botões: consulta, online, perfil
    - consulta: consulta atual (caso online, mostra link) | buscar paciente por cpf | proxima consulta (caso online, mostra link)
    - perfil: visualizar dados pessoais | horários de trabalho
    *todas as buscas por pacientes retornam dados do paciente e botões ampliáveis de: histórico de consultas | resultado de exames | receita médica | atestado 



#### banco de dados:
- *atendente: cpf(PK), nome completo, email, senha, celular, endereco
- medico: cpf(PK), nome completo, email, senha, celular, endereco, nascimento, crm, especialidades[], idAgenda(FK)
- paciente: cpf(PK), nome completo, idFamlia(FK), email, celular, endereco, nascimento
- *convenioPaciente: carteirinha(PK), idConv(FK), cpf(FK), validade
- *familia: idFamilia(PK), cpf(FK)
- *dadosAdicionaisPaciente: cpf(FK), historico, medicamentos[], tipoSangue, contatoEmergencia{nome completo, celular} 
- *consulta/exame/retorno: idConsulta(PK), cpfPaciente(FK), cpfMedico(FK), data, horario, especialidade, status(realizada/cancelada/agendada), pagamento(pago/pendente)(FK), tipo(consulta/exame/retorno), local(presencial/online), link(caso online), queixas
- *pagamento: idPagamento(PK), status, data
- *registroMedico (pós-consulta): idRegistroMedico(PK), idConsulta(FK), examesSolicitados[], medicamentosSolicitados[], observacoesMedicas, atestado[]
- *convenioClinica: idConv(PK), nome, medicos[](FK)
- *consultasTipo: idConsultaTipo(PK), especialidades, preco
- *examesTipo: idExame(PK), tipo, preco, coberturaConvenio
- *agenda: cpfMedico(PK), data { hora { idConsulta(FK), disponivel(boolean) }}
- **logAcoes: idLog(PK), cpfResponsavel(FK), acao, timestamp, idAfetado(FK) (ou cpf)

*feito
**implementar no crud!



#### implementar:
- token de login que carregue entre as páginas

