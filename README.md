# clinica-medica

#### sobre:
esse projeto foi feito em etapas: primeiro foi pensado quais funcionalidades uma clínica médica deve ter e foram discutidos três tipos de usuário - paciente, atendente e médico; depois o banco de dados foi construído considerando como implementar as funcionalidades; após isso, o site foi construído para apoiar os usuários atendente e médico enquanto o aplicativo foi pensado para o paciente.

#### ferramentas:
react (SPA) & firebase (realtime database & authentication)

#### como executar:
para executar localmente, é necessária a instalação do node.js. 
um projeto no firebase deve ser criado e configurados realtime database e authentication (email e senha). é necessário criar os usuários diretamente no authentication, pois o sistema não possui cadastro, e adicioná-los ao database na tabela "users" (utilize o database.json como base e o importe ao database). após isso, crie um .env na mesma pasta do .env.example e adicione valores do firebase usando o exemplo como base.
no terminal, execute :
 ```
 cd website 
 npm install
 npm run dev 
```
depois, entre em http://localhost:5173.


#### funcionalidades:
- atendente & médico: login, especialidades médicas, convênios
- atendente: 
    - home: buscar paciente por cpf -> visualizar dados (+ histórico médico) | editar perfil | consultas médicas e respectivos exames | inserir consulta | visualizar agenda médico
    - editar perfil: dados paciente, convênio, família, dados adicionais do paciente buscado no cpf 
    - perfil: visualizar dados pessoais | horários de trabalho
- médico:
    - home: visualizar agenda -> visualizar pacientes do dia -> visualizar informações paciente: dados pessoais, queixas, histórico médico & adicionar receita médica, atestado médico, observações e solicitar exames | buscar paciente por cpf -> visualizar informações paciente: dados pessoais, histórico médico & visualizar consultas passadas/agendadas e exames agendados/realizados 
    - perfil: visualizar dados pessoais | horários de trabalho
 

#### estrutura banco de dados:
- atendente: cpf(PK), nome completo, email, senha, celular, endereco
- medico: cpf(PK), nome completo, email, senha, celular, endereco, nascimento, crm, especialidades[], idAgenda(FK)
- paciente: cpf(PK), nome completo, idFamlia(FK), email, celular, endereco, nascimento
- convenioPaciente: carteirinha(PK), idConv(FK), cpf(FK), validade
- familia: idFamilia(PK), cpf(FK)
- dadosAdicionaisPaciente: cpf(FK), historico, medicamentos[], tipoSangue, contatoEmergencia{nome completo, celular} 
- consulta/exame/retorno: idConsulta(PK), cpfPaciente(FK), cpfMedico(FK), data, horario, especialidade, status(realizada/cancelada/agendada), pagamento(pago/pendente)(FK), tipo(consulta/exame/retorno), local(presencial/online), link(caso online), queixas
- pagamento: idPagamento(PK), status, data
- registroMedico (pós-consulta): idRegistroMedico(PK), idConsulta(FK), examesSolicitados[], medicamentosSolicitados[], observacoesMedicas, atestado[]
- convenioClinica: idConv(PK), nome, medicos[](FK)
- consultasTipo: idConsultaTipo(PK), especialidades, preco
- examesTipo: idExame(PK), tipo, preco, coberturaConvenio
- agenda: cpfMedico(PK), data { hora { idConsulta(FK), disponivel(boolean) }}
- logAcoes: idLog(PK), cpfResponsavel(FK), acao, timestamp, idAfetado(FK) (ou cpf)


#### próximos passos:
- funcionário: cancelar consulta, pagamento consulta/exame
- médico: visualizar próxima consulta

#### vídeo com execução real do sistema:

youtube.com
