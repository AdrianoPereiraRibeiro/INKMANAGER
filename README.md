# InkManager

> Sistema web de gerenciamento de agendamentos para estúdios de tatuagem.

## 📖 Sobre o Projeto

O **InkManager** é uma plataforma web que conecta clientes a tatuadores, permitindo o gerenciamento completo de agendamentos, perfis profissionais e acompanhamento de sessões. O sistema possui dois tipos de perfil: **Cliente** e **Tatuador (Artista)**, cada um com funcionalidades específicas.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Front-end | React |
| Back-end | C# (.NET) |
| Banco de Dados | SQL Server |

---

## 🚀 Como Instalar e Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [.NET SDK](https://dotnet.microsoft.com/) (v7 ou superior)
- [SQL Server](https://www.microsoft.com/pt-br/sql-server) (local ou remoto)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/inkmanager.git
cd inkmanager
```

### 2. Configurar o Banco de Dados

Atualize a connection string no arquivo `appsettings.json` do back-end:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=SEU_SERVIDOR;Database=InkManager;User Id=SEU_USUARIO;Password=SUA_SENHA;"
}
```

Execute as migrations:

```bash
cd backend
dotnet ef database update
```

### 3. Executar o Back-end

```bash
cd backend
dotnet run
```

### 4. Executar o Front-end

```bash
cd frontend
npm install
npm run dev
```

---

## ✅ Funcionalidades Implementadas

### Autenticação
- Cadastro de usuários (Cliente e Tatuador)
- Login com seleção de tipo de perfil
- Logout

### Perfil do Cliente
- Visualização e edição de nome e e-mail
- Alteração de senha

### Catálogo de Tatuadores
- Listagem pública de tatuadores disponíveis
- Exibição de especialidade, horários e biografia de cada profissional

### Agendamento (Cliente)
- Solicitação de agendamento com data, horário, estilo, tamanho, local do corpo e descrição da ideia
- Acompanhamento do status dos agendamentos (Em Análise / Confirmado)
- Download de instruções pós-tattoo em PDF

### Painel do Artista
- Dashboard com total de sessões e faturamento estimado
- Gráfico de evolução mensal de atendimentos
- Listagem e análise de solicitações recentes
- Aceitar ou recusar pedidos com definição de orçamento

### Perfil Profissional (Tatuador)
- Edição de nome, e-mail, especialidades e biografia
- Configuração de horários e dias de atendimento
- Status da agenda (disponível / indisponível)
- Alteração de senha

---

## 📋 ToDo — Funcionalidades Não Implementadas

- [ ] Upload de fotos de portfólio pelo tatuador
- [ ] Sistema de avaliações e comentários por clientes
- [ ] Notificações por e-mail ao confirmar/recusar agendamento
- [ ] Filtros de busca no catálogo (estilo, disponibilidade)
- [ ] Chat interno entre cliente e tatuador
- [ ] Painel administrativo geral da plataforma
- [ ] Relatórios financeiros em PDF para o tatuador
- [ ] Internacionalização (EN / ES além do PT-BR)
- [ ] Integração com pagamento online
- [ ] Calendário visual de agendamentos para o artista

---

## 👥 Integrantes

| Nome | Função |
|------|--------|
| Adrino Pereira Ribeiro| Back-end / Banco de Dados / Documentação |
| Cesar Alencar Machado Cardoso Junior | Front-end / Documentação |

---

## 📄 Licença

Projeto acadêmico — Ciência da Computação, IFSC Campus Lages  
Disciplina: Laboratório de Desenvolvimento de Sistemas — Fase 5
