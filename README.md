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
| Internacionalização | i18n (PT-BR e EN) |

---

## 🗂️ Estrutura do Projeto
INKMANAGER/

INKMANAGER/

├── InkManagerAPI/               # API em C# (.NET)

│   ├── Controllers/

│   │   ├── AppointmentController.cs

│   │   ├── ArtistController.cs

│   │   ├── AuthController.cs

│   │   └── DashboardController.cs

│   ├── Data/                    # Contexto do Entity Framework

│   ├── Migrations/              # Migrations do banco de dados

│   ├── Models/

│   │   ├── Appointment.cs       # Entidade de Agendamento

│   │   ├── TattoArtist.cs       # Entidade de Tatuador

│   │   ├── User.cs              # Entidade de Usuário

│   │   └── Enums.cs             # Enumerações do sistema

│   ├── Services/                # Regras de negócio

│   ├── Program.cs

│   └── appsettings.json

│

└── ink-manager-front/           # Aplicação React

├── public/

└── src/

├── context/             # Contextos globais (autenticação)

├── hooks/               # Custom hooks

├── i18n/

│   ├── index.js

│   └── locales/

│       ├── en.json      # Inglês

│       └── pt.json      # Português

├── pages/

│   ├── artist/

│   │   ├── ArtistProfile.jsx

│   │   └── Dashboard.jsx

│   ├── client/

│   │   ├── AppointmentForm.jsx

│   │   ├── Catalog.jsx

│   │   ├── MyAppointments.jsx

│   │   └── Profile.jsx

│   ├── Login.jsx

│   └── Register.jsx

├── services/            # Comunicação com a API

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

Atualize a connection string no arquivo `InkManagerAPI/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=SEU_SERVIDOR;Database=InkManager;User Id=SEU_USUARIO;Password=SUA_SENHA;"
}
```

Execute as migrations para criar as tabelas:

```bash
cd InkManagerAPI
dotnet ef database update
```

### 3. Executar o Back-end

```bash
cd InkManagerAPI
dotnet run
```

A API estará disponível em: `http://localhost:5000`

### 4. Executar o Front-end

```bash
cd ink-manager-front
npm install
npm run dev
```

O front-end estará disponível em: `http://localhost:5173`

---

## 🧩 Entidades do Sistema

| Entidade | Descrição |
|----------|-----------|
| `User` | Usuário do sistema (cliente ou tatuador) |
| `TattoArtist` | Perfil profissional do tatuador com especialidades e horários |
| `Appointment` | Agendamento entre cliente e tatuador |
| `Enums` | Status do agendamento e outros tipos enumerados |

---

## ✅ Funcionalidades Implementadas

### Autenticação (`AuthController`)
- Cadastro de usuários com seleção de tipo de perfil (Cliente ou Tatuador)
- Login com e-mail, senha e tipo de perfil
- Logout

### Perfil do Cliente (`Profile.jsx`)
- Visualização e edição de nome completo e e-mail
- Alteração de senha com confirmação

### Catálogo de Tatuadores (`Catalog.jsx`)
- Listagem pública de tatuadores com agenda disponível
- Exibição de especialidade, horários de atendimento e biografia

### Agendamento (`AppointmentController` + `AppointmentForm.jsx`)
- Solicitação de agendamento com: data, horário, estilo da tatuagem, tamanho estimado, local do corpo e descrição da ideia
- Acompanhamento do status dos pedidos em `MyAppointments.jsx` (Em Análise / Confirmado)
- Download de instruções pós-tattoo em PDF para agendamentos confirmados

### Painel do Artista (`DashboardController` + `Dashboard.jsx`)
- Dashboard com total de sessões e faturamento estimado
- Gráfico de evolução mensal de atendimentos por ano
- Listagem de solicitações de agendamento recentes
- Análise detalhada de cada pedido (estilo, tamanho, local, descrição)
- Aceitar agendamento com definição de valor do orçamento
- Recusar pedidos de agendamento

### Perfil Profissional (`ArtistController` + `ArtistProfile.jsx`)
- Edição de nome profissional, e-mail de contato, especialidades e biografia
- Configuração de horário de abertura, fechamento e dias de atendimento
- Ativação/desativação da agenda (disponível para novos agendamentos)
- Alteração de senha com confirmação

### Internacionalização
- Suporte a Português (PT-BR) e Inglês (EN)
- Idioma detectado automaticamente conforme configuração do sistema do usuário

---

## 📋 ToDo — Funcionalidades Não Implementadas

- [ ] Internacionalização para Espanhol (ES)
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
| Adriano Pereira Ribeiro | Banco de Dados / Back-end / Documentação |
| Cesar Alencar Machado Cardisi Junior | Front-end / Internacionalização / Documentação |

---

## 📄 Licença

Projeto acadêmico — Ciência da Computação, IFSC Campus Lages  
Disciplina: Laboratório de Desenvolvimento de Sistemas — Fase 5
