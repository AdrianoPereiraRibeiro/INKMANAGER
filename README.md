# InkManager

> Sistema web de gerenciamento de agendamentos para estúdios de tatuagem.

## 📖 Sobre o Projeto

O **InkManager** é uma plataforma web que conecta clientes a tatuadores, permitindo o gerenciamento completo de agendamentos, perfis profissionais e acompanhamento de sessões. O sistema possui dois tipos de perfil: **Cliente** e **Tatuador (Artista)**, cada um com funcionalidades específicas.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Front-end | React + Vite |
| Back-end | C# (.NET) — ASP.NET Core Web API |
| Banco de Dados | SQL Server |
| ORM | Entity Framework Core (Code First + Migrations) |
| Internacionalização | i18n (PT-BR, EN, ES) |

---

## 🗂️ Estrutura do Projeto

INKMANAGER/

├── backend/                  # API em C# (.NET)

│   ├── Controllers/          # Endpoints da API REST

│   ├── Data/                 # Contexto do Entity Framework

│   ├── Migrations/           # Migrations do banco de dados

│   ├── Models/               # Entidades do sistema

│   ├── Services/             # Regras de negócio

│   ├── Program.cs

│   └── appsettings.json

│

└── frontend/                 # Aplicação React

├── public/

└── src/

├── context/          # Contextos globais (autenticação, etc.)

├── hooks/            # Custom hooks

├── i18n/             # Arquivos de internacionalização

├── pages/            # Telas da aplicação

├── services/         # Comunicação com a API

├── App.jsx

└── main.jsx

---

## 🚀 Como Instalar e Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [.NET SDK](https://dotnet.microsoft.com/) (v7 ou superior)
- [SQL Server](https://www.microsoft.com/pt-br/sql-server) (local ou remoto)

### 1. Clone o repositório

```bash
git clone https://github.com/AdrianoPereiraRibeiro/INKMANAGER.git
cd INKMANAGER
```

### 2. Configurar o Banco de Dados

Atualize a connection string no arquivo `backend/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=SEU_SERVIDOR;Database=InkManager;User Id=SEU_USUARIO;Password=SUA_SENHA;"
}
```

Execute as migrations para criar as tabelas:

```bash
cd backend
dotnet ef database update
```

### 3. Executar o Back-end

```bash
cd backend
dotnet run
```

A API estará disponível em: `http://localhost:5000`

### 4. Executar o Front-end

```bash
cd frontend
npm install
npm run dev
```

O front-end estará disponível em: `http://localhost:5173`

---

## ✅ Funcionalidades Implementadas

### Autenticação
- Cadastro de usuários com seleção de tipo de perfil (Cliente ou Tatuador)
- Login com e-mail, senha e tipo de perfil
- Logout

### Perfil do Cliente
- Visualização e edição de nome completo e e-mail
- Alteração de senha com confirmação

### Catálogo de Tatuadores
- Listagem pública de tatuadores com agenda disponível
- Exibição de especialidade, horários de atendimento e biografia

### Agendamento (Cliente)
- Solicitação de agendamento com: data, horário, estilo da tatuagem, tamanho estimado, local do corpo e descrição da ideia
- Acompanhamento do status dos pedidos (Em Análise / Confirmado)
- Download de instruções pós-tattoo em PDF para agendamentos confirmados

### Painel do Artista (Tatuador)
- Dashboard com total de sessões e faturamento estimado
- Gráfico de evolução mensal de atendimentos por ano
- Listagem de solicitações de agendamento recentes
- Análise detalhada de cada pedido (estilo, tamanho, local, descrição)
- Aceitar agendamento com definição de valor do orçamento
- Recusar pedidos de agendamento

### Perfil Profissional (Tatuador)
- Edição de nome profissional, e-mail de contato, especialidades e biografia
- Configuração de horário de abertura, fechamento e dias de atendimento
- Ativação/desativação da agenda (disponível para novos agendamentos)
- Alteração de senha com confirmação

### Internacionalização
- Sistema preparado para múltiplos idiomas via i18n
- Suporte a Português (PT-BR), Inglês (EN) e Espanhol (ES)
- Idioma detectado automaticamente conforme configuração do sistema do usuário

---

## 📋 ToDo — Funcionalidades Não Implementadas

- [ ] Upload de fotos de portfólio pelo tatuador
- [ ] Sistema de avaliações e comentários por clientes
- [ ] Notificações por e-mail ao confirmar/recusar agendamento
- [ ] Filtros de busca no catálogo (por estilo, disponibilidade, localidade)
- [ ] Chat interno entre cliente e tatuador
- [ ] Painel administrativo geral da plataforma
- [ ] Relatórios financeiros em PDF para o tatuador
- [ ] Integração com pagamento online
- [ ] Calendário visual de agendamentos para o artista

---

## 👥 Integrantes

| Nome | Função |
|------|--------|
| Adriano Pereira Ribeiro | Front-end / Back-end |
| [Nome do outro integrante] | Back-end / Banco de Dados |

---

## 📄 Licença

Projeto acadêmico — Ciência da Computação, IFSC Campus Lages  
Disciplina: Laboratório de Desenvolvimento de Sistemas — Fase 5
