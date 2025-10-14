# ✅ Checklist de Deploy - Open Doors Simetria

## Status Atual

- ✅ Frontend no Vercel (feito)
- ❌ Backend em produção (FALTA FAZER)
- ❌ Frontend conectado ao backend (FALTA CONFIGURAR)

---

## O que você precisa fazer agora

### 1️⃣ Fazer Deploy do Backend no Render

📖 **Guia rápido:** `DEPLOY_RAPIDO.md`
📖 **Guia detalhado:** `INSTRUCOES_DEPLOY_RENDER.md`

**Resumo:**
1. Acesse https://render.com
2. Faça login com GitHub
3. Crie um "Web Service"
4. Conecte o repositório "Site Hackaton"
5. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Adicione variáveis de ambiente (mínimo: PORT, NODE_VERSION, FRONTEND_URL)
6. Clique em "Create Web Service"
7. Aguarde 5-10 minutos

### 2️⃣ Me Enviar a URL do Backend

Quando o deploy terminar, você vai ver uma URL tipo:
`https://open-doors-backend.onrender.com`

**ME ENVIE ESSA URL!**

Vou usar ela para configurar o frontend.

### 3️⃣ Configurar Vercel (eu vou te guiar)

Depois que você me enviar a URL, vou te guiar para:
1. Adicionar variável de ambiente no Vercel
2. Fazer redeploy do frontend
3. Testar inscrições

---

## Variáveis de Ambiente Necessárias

### No Render (Backend):

**OBRIGATÓRIAS:**
- `PORT` = `5000`
- `NODE_VERSION` = `18.0.0`
- `FRONTEND_URL` = URL do seu site Vercel

**OPCIONAIS (apenas se quiser enviar e-mails):**
- `EMAIL_SERVICE` = `gmail`
- `EMAIL_USER` = seu-email@gmail.com
- `EMAIL_PASS` = senha-de-app-do-gmail

### No Vercel (Frontend):

**Vou configurar depois:**
- `VITE_API_URL` = URL do backend no Render

---

## Estimativa de Tempo

- ⏱️ Deploy no Render: 5-10 minutos
- ⏱️ Configurar Vercel: 2 minutos
- ⏱️ Testar: 1 minuto

**Total: ~15 minutos**

---

## Próximo Passo

👉 **Abra o arquivo `DEPLOY_RAPIDO.md` e siga os 5 passos!**

Quando terminar, me envie a URL do backend! 🚀

