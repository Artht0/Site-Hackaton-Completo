# 🎉 Hackathon Escolar 2025 - Sistema de Inscrições

Sistema completo de inscrições para o Hackathon Escolar 2025, com frontend React e backend Node.js, incluindo envio automático de e-mails de confirmação.

## 📋 Sobre o Projeto

Este é um sistema full-stack completo que permite:
- ✅ Inscrição de participantes com validação de dados
- ✅ Escolha de oficinas com interface visual intuitiva
- ✅ Aceitação de termo de responsabilidade
- ✅ Envio automático de e-mail de confirmação
- ✅ Interface responsiva e moderna
- ✅ Armazenamento de inscrições em arquivo JSON

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Router** - Navegação entre páginas
- **Axios** - Requisições HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Nodemailer** - Envio de e-mails
- **Express Validator** - Validação de dados
- **CORS** - Comunicação entre frontend e backend

## 📁 Estrutura do Projeto

```
hackathon-inscricoes/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TermoModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Inscricao.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── routes/
│   │   └── inscricoes.js
│   ├── utils/
│   │   └── emailService.js
│   ├── data/
│   │   └── inscricoes.json (criado automaticamente)
│   ├── server.js
│   ├── package.json
│   └── .env (você precisa criar)
└── README.md
```

## 🔧 Instalação e Configuração

### 1. Clonar o Repositório

```bash
cd hackathon-inscricoes
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

#### Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
PORT=5000

# Configurações de E-mail
EMAIL_SERVICE=gmail
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANTE - Configuração do Gmail:**

Para usar o Gmail, você precisa gerar uma "Senha de App":

1. Acesse [Google Account](https://myaccount.google.com/)
2. Vá em **Segurança**
3. Ative a **Verificação em duas etapas** (se ainda não estiver ativada)
4. Procure por **Senhas de app**
5. Gere uma nova senha para "E-mail"
6. Use essa senha no campo `EMAIL_PASS` (não use sua senha normal!)

**Outros serviços de e-mail:**
- Para Outlook/Hotmail: `EMAIL_SERVICE=hotmail`
- Para Yahoo: `EMAIL_SERVICE=yahoo`
- Para outros: configure SMTP manualmente no código

### 3. Configurar o Frontend

```bash
cd ../frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend/` (opcional):

```env
VITE_API_URL=http://localhost:5000
```

> **Nota:** Se você não criar este arquivo, a aplicação usará `http://localhost:5000` por padrão.

## ▶️ Como Rodar o Projeto

### Iniciar o Backend

```bash
cd backend
npm start
```

O servidor estará rodando em: `http://localhost:5000`

### Iniciar o Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

## 🌐 Deploy

### Deploy do Frontend (Vercel)

1. Instale a CLI da Vercel:
```bash
npm install -g vercel
```

2. Na pasta `frontend/`, execute:
```bash
vercel
```

3. Configure a variável de ambiente na Vercel:
   - `VITE_API_URL` = URL do seu backend em produção

**Ou via interface web:**
1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório
3. Defina a pasta `frontend` como diretório raiz
4. Configure as variáveis de ambiente
5. Deploy!

### Deploy do Backend (Render)

1. Acesse [render.com](https://render.com) e crie uma conta
2. Clique em **New +** → **Web Service**
3. Conecte seu repositório Git
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Adicione as variáveis de ambiente:
   - `PORT` = 5000 (ou deixe em branco para usar a porta do Render)
   - `EMAIL_SERVICE` = gmail
   - `EMAIL_USER` = seu-email@gmail.com
   - `EMAIL_PASS` = sua-senha-de-app
   - `FRONTEND_URL` = URL do seu frontend na Vercel
6. Deploy!

### Deploy do Backend (Railway)

1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto
3. Selecione **Deploy from GitHub repo**
4. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
5. Adicione as variáveis de ambiente (mesmo do Render)
6. Deploy!

### Após o Deploy

Não esqueça de:
1. Atualizar `VITE_API_URL` no frontend com a URL do backend em produção
2. Atualizar `FRONTEND_URL` no backend com a URL do frontend em produção
3. Testar o envio de e-mails
4. Verificar se o CORS está funcionando corretamente

## 📝 API Endpoints

### POST `/api/inscricoes`

Cria uma nova inscrição.

**Body:**
```json
{
  "nome": "Fulano de Tal",
  "cpf": "000.000.000-00",
  "email": "fulano@email.com",
  "oficina": "Oficina 1 – Robótica Criativa"
}
```

**Resposta (Sucesso - 201):**
```json
{
  "status": "ok",
  "message": "Inscrição salva e e-mail enviado com sucesso!",
  "inscricao": {
    "id": 1697123456789,
    "nome": "Fulano de Tal",
    "oficina": "Oficina 1 – Robótica Criativa"
  }
}
```

**Resposta (Erro - 400):**
```json
{
  "status": "error",
  "message": "Preencha todos os campos corretamente."
}
```

### GET `/api/inscricoes`

Lista todas as inscrições (sem dados sensíveis).

**Resposta:**
```json
{
  "status": "ok",
  "total": 5,
  "inscricoes": [
    {
      "id": 1697123456789,
      "nome": "Fulano de Tal",
      "oficina": "Oficina 1 – Robótica Criativa",
      "dataInscricao": "2025-10-14T10:00:00.000Z"
    }
  ]
}
```

## 🎨 Oficinas Disponíveis

1. **Oficina 1 – Robótica Criativa** 🤖
2. **Oficina 2 – Design Thinking** 🎨
3. **Oficina 3 – Programação Web** 💻
4. **Oficina 4 – Inteligência Artificial** 🧠
5. **Oficina 5 – Desenvolvimento Mobile** 📱
6. **Oficina 6 – Segurança Digital** 🔒

## ✨ Funcionalidades

### Frontend
- ✅ Página inicial com informações do evento
- ✅ Formulário de inscrição com validação em tempo real
- ✅ Validação de CPF e e-mail
- ✅ Seleção visual de oficinas com animações
- ✅ Modal com termo de responsabilidade
- ✅ Feedback visual de sucesso/erro
- ✅ Design responsivo para mobile e desktop
- ✅ Transições e animações suaves

### Backend
- ✅ Validação de dados
- ✅ Verificação de duplicidade (CPF e e-mail)
- ✅ Armazenamento em JSON
- ✅ Envio automático de e-mail HTML formatado
- ✅ Tratamento de erros
- ✅ CORS habilitado
- ✅ Logs detalhados

## 🔒 Segurança

- Validação de entrada de dados no backend
- Sanitização básica de campos
- Verificação de duplicidade de CPF e e-mail
- Dados sensíveis removidos em listagens públicas
- CORS configurado corretamente
- Variáveis de ambiente para credenciais

## 🐛 Solução de Problemas

### E-mails não estão sendo enviados

1. Verifique se as variáveis `EMAIL_USER` e `EMAIL_PASS` estão corretas no `.env`
2. Para Gmail, certifique-se de usar uma "Senha de App", não sua senha normal
3. Verifique os logs do servidor para erros específicos
4. Teste com um serviço de e-mail diferente

### CORS Error

Certifique-se de que:
1. O backend está rodando
2. A URL do backend está correta no frontend
3. O CORS está habilitado no servidor (já está configurado)

### Inscrição não está sendo salva

1. Verifique se a pasta `backend/data/` existe
2. Verifique as permissões de escrita
3. Veja os logs do servidor para erros

## 📞 Suporte

Para problemas ou dúvidas:
- Verifique os logs do console (F12 no navegador)
- Verifique os logs do servidor backend
- Certifique-se de que todas as dependências foram instaladas

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

## 👨‍💻 Desenvolvimento

Para modo de desenvolvimento com hot reload:

**Backend (Node.js 18+):**
```bash
npm run dev
```

**Frontend:**
```bash
npm run dev
```

## 🎯 Próximas Melhorias

- [ ] Autenticação de administrador
- [ ] Painel administrativo para gerenciar inscrições
- [ ] Exportação de dados para CSV/Excel
- [ ] Limite de vagas por oficina
- [ ] Confirmação por SMS
- [ ] Integração com banco de dados (MongoDB/PostgreSQL)
- [ ] Sistema de check-in no evento
- [ ] Geração de certificados

---

**Desenvolvido para o Hackathon Escolar 2025** 🚀

Bom evento! 🎉

