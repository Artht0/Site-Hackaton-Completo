# 🚀 Deploy Rápido - 5 Passos

## 1️⃣ Subir código para GitHub (se ainda não fez)
```bash
git add .
git commit -m "Deploy backend"
git push
```

## 2️⃣ Acessar Render
- Vá para: **https://render.com**
- Faça login com GitHub

## 3️⃣ Criar Web Service
- Clique em **"New +"** → **"Web Service"**
- Escolha o repositório **"Site Hackaton"**
- Clique em **"Connect"**

## 4️⃣ Configurar
**Informações básicas:**
- Name: `open-doors-backend`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Plan: **Free**

**Variáveis de ambiente (mínimas):**
- `PORT` = `5000`
- `NODE_VERSION` = `18.0.0`
- `FRONTEND_URL` = Cole a URL do seu site Vercel aqui

## 5️⃣ Deploy
- Clique em **"Create Web Service"**
- Aguarde 5-10 minutos
- Copie a URL gerada (ex: `https://open-doors-backend.onrender.com`)
- **ME ENVIE ESSA URL!**

---

📖 **Precisa de mais detalhes?** Veja `INSTRUCOES_DEPLOY_RENDER.md`

