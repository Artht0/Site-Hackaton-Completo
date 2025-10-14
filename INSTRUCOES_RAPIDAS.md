# 🚀 Instruções Rápidas de Instalação

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Configurar Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/`:
```env
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
FRONTEND_URL=http://localhost:3000
```

**📧 Como conseguir a Senha de App do Gmail:**
1. Acesse https://myaccount.google.com/
2. Vá em **Segurança** → **Verificação em duas etapas** (ative se não estiver)
3. Procure **Senhas de app**
4. Crie uma senha para "E-mail"
5. Cole no arquivo `.env`

Inicie o servidor:
```bash
npm start
```

✅ Backend rodando em: http://localhost:5000

---

### 2️⃣ Configurar Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend rodando em: http://localhost:3000

---

## 🎯 Testar o Sistema

1. Abra http://localhost:3000
2. Clique em "Inscreva-se Agora"
3. Preencha o formulário:
   - Nome completo
   - CPF (formato: 000.000.000-00)
   - E-mail válido
   - Escolha uma oficina
   - Aceite o termo
4. Clique em "Enviar Inscrição"
5. ✅ Verifique seu e-mail!

---

## 📦 Estrutura de Arquivos Importantes

```
├── backend/
│   ├── .env               ← Você precisa criar!
│   ├── package.json       ← Dependências
│   ├── server.js          ← Servidor principal
│   └── data/
│       └── inscricoes.json ← Criado automaticamente
│
└── frontend/
    ├── package.json       ← Dependências
    └── src/
        ├── pages/
        │   ├── Home.jsx
        │   └── Inscricao.jsx
        └── components/
            └── TermoModal.jsx
```

---

## 🐛 Problemas Comuns

### ❌ "E-mail não enviado"
- Verifique se usou uma **Senha de App**, não sua senha normal
- Confira se o Gmail tem verificação em 2 etapas ativada

### ❌ "CORS Error"
- Certifique-se de que o backend está rodando
- Verifique se a URL está correta

### ❌ "npm: command not found"
- Instale o Node.js: https://nodejs.org/

---

## 🌐 Pronto para Deploy?

Leia o arquivo **README.md** completo para instruções detalhadas de deploy na Vercel (frontend) e Render/Railway (backend).

---

**Qualquer dúvida? Confira o README.md completo!** 📚

