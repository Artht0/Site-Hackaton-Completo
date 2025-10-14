# 🚀 Guia Completo de Deploy

Este guia detalha como fazer o deploy do sistema em produção.

## 📋 Pré-requisitos

- [ ] Conta no GitHub (para versionamento)
- [ ] Conta na Vercel (frontend) - https://vercel.com
- [ ] Conta no Render ou Railway (backend)
- [ ] E-mail configurado para envio (Gmail, SendGrid, etc.)

---

## 1️⃣ Preparar o Repositório

### Subir para o GitHub

```bash
git init
git add .
git commit -m "Projeto Open Doors Simetria 2025 completo"
git branch -M main
git remote add origin https://github.com/seu-usuario/open-doors-simetria.git
git push -u origin main
```

---

## 2️⃣ Deploy do Frontend (Vercel)

### Opção A: Via Interface Web

1. **Acessar Vercel**
   - Vá para https://vercel.com
   - Faça login com GitHub

2. **Importar Projeto**
   - Clique em "Add New..." → "Project"
   - Selecione o repositório `open-doors-simetria`
   - Clique em "Import"

3. **Configurar Projeto**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Variáveis de Ambiente**
   - Clique em "Environment Variables"
   - Adicione:
     ```
     VITE_API_URL = https://sua-api.onrender.com
     ```
   - ⚠️ Você vai pegar essa URL depois de fazer deploy do backend!

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde 2-3 minutos
   - ✅ Seu site estará no ar!
   - URL será algo como: `https://open-doors-simetria.vercel.app`

### Opção B: Via CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Siga as instruções no terminal.

### Atualizar Deploy

Sempre que você fizer um commit na branch `main`, o Vercel atualiza automaticamente!

```bash
git add .
git commit -m "Atualização do frontend"
git push
```

---

## 3️⃣ Deploy do Backend (Render)

### Passo a Passo

1. **Criar Conta**
   - Acesse https://render.com
   - Faça login com GitHub

2. **Criar Web Service**
   - No dashboard, clique em "New +"
   - Selecione "Web Service"

3. **Conectar Repositório**
   - Selecione o repositório `open-doors-simetria`
   - Clique em "Connect"

4. **Configurar Serviço**
   ```
   Name: open-doors-backend
   Region: Oregon (US West) ou mais próximo
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Plano**
   - Selecione "Free" (ou pago se preferir)
   - ⚠️ Free tier tem limitações mas funciona para testes

6. **Variáveis de Ambiente**
   
   Clique em "Environment" e adicione:
   
   ```
   PORT = 5000
   EMAIL_SERVICE = gmail
   EMAIL_USER = seu-email@gmail.com
   EMAIL_PASS = sua-senha-de-app
   FRONTEND_URL = https://open-doors-simetria.vercel.app
   NODE_VERSION = 18.0.0
   ```

7. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde 5-10 minutos
   - ✅ Backend no ar!
   - URL será algo como: `https://open-doors-backend.onrender.com`

### Testar Backend

Abra no navegador:
```
https://open-doors-backend.onrender.com/
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "API do Open Doors Simetria 2025 está funcionando!"
}
```

---

## 4️⃣ Conectar Frontend e Backend

### No Vercel (Frontend)

1. Vá em "Settings" → "Environment Variables"
2. Edite `VITE_API_URL`:
   ```
   VITE_API_URL = https://open-doors-backend.onrender.com
   ```
3. Clique em "Save"
4. Vá em "Deployments" → "Redeploy"

### No Render (Backend)

1. Vá em "Environment"
2. Edite `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://open-doors-simetria.vercel.app
   ```
3. Salve (o serviço reiniciará automaticamente)

---

## 5️⃣ Deploy do Backend (Railway) - Alternativa

### Passo a Passo

1. **Criar Conta**
   - Acesse https://railway.app
   - Faça login com GitHub

2. **Novo Projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha `open-doors-simetria`

3. **Configurar**
   - Root Directory: `backend`
   - Start Command: `npm start`

4. **Variáveis de Ambiente**
   
   Na aba "Variables", adicione:
   ```
   EMAIL_SERVICE = gmail
   EMAIL_USER = seu-email@gmail.com
   EMAIL_PASS = sua-senha-de-app
   FRONTEND_URL = https://open-doors-simetria.vercel.app
   NODE_VERSION = 18
   ```

5. **Gerar Domínio**
   - Na aba "Settings", procure "Domains"
   - Clique em "Generate Domain"
   - Copie a URL gerada

6. **Deploy**
   - Railway faz deploy automaticamente
   - ✅ Backend no ar!

---

## 6️⃣ Testar o Sistema Completo

### Checklist de Testes

- [ ] Frontend carrega sem erros
- [ ] Página inicial aparece corretamente
- [ ] Botão "Inscreva-se" funciona
- [ ] Formulário aparece completo
- [ ] Oficinas aparecem com cores e animações
- [ ] Modal do termo abre e fecha
- [ ] Validação de CPF funciona
- [ ] Validação de e-mail funciona
- [ ] Inscrição é enviada ao backend
- [ ] E-mail de confirmação é recebido
- [ ] GET /api/inscricoes retorna dados

### Testar Envio de Inscrição

1. Acesse o site em produção
2. Preencha o formulário com seus dados reais
3. Envie a inscrição
4. Verifique seu e-mail
5. ✅ Sucesso!

---

## 7️⃣ Monitoramento

### Logs do Backend (Render)

1. No dashboard do Render
2. Clique no serviço
3. Aba "Logs"
4. Veja logs em tempo real

### Logs do Backend (Railway)

1. No dashboard do Railway
2. Clique no projeto
3. Aba "Deployments"
4. Clique em "View Logs"

### Analytics (Vercel)

1. No projeto da Vercel
2. Aba "Analytics"
3. Veja visitas, performance, etc.

---

## 8️⃣ Atualizações

### Atualizar Frontend

```bash
git add .
git commit -m "Atualização"
git push
```

Vercel faz deploy automático!

### Atualizar Backend

```bash
git add .
git commit -m "Atualização"
git push
```

Render/Railway fazem deploy automático!

---

## 🔧 Solução de Problemas

### "Application Error" no backend

**Soluções:**
- Verifique os logs
- Confirme que todas as variáveis de ambiente estão corretas
- Verifique se o `package.json` tem `"type": "module"`

### CORS Error

**Soluções:**
- Confirme que `FRONTEND_URL` no backend está correto
- Confirme que `VITE_API_URL` no frontend está correto
- Ambos devem usar HTTPS em produção

### E-mails não enviados

**Soluções:**
- Use SendGrid para produção (mais confiável)
- Verifique se a senha de app está correta
- Veja os logs do backend para erros específicos

### Free tier do Render "dorme"

O plano gratuito do Render coloca o servidor para "dormir" após 15 minutos de inatividade.

**Soluções:**
- Upgrade para plano pago ($7/mês)
- Use um serviço de "ping" para manter ativo
- Aceite a lentidão inicial (30 segundos para "acordar")

---

## 💰 Custos Estimados

### Opção 100% Gratuita

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Hobby | R$ 0 |
| Render | Free | R$ 0 |
| GitHub | Free | R$ 0 |
| Gmail | - | R$ 0 |
| **TOTAL** | | **R$ 0/mês** |

**Limitações:**
- Backend "dorme" após inatividade
- 100 e-mails/dia no Gmail
- Sem domínio customizado

### Opção Profissional

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Pro | ~R$ 100/mês |
| Render | Starter | ~R$ 35/mês |
| SendGrid | Essentials | ~R$ 75/mês |
| Domínio | .com | ~R$ 60/ano |
| **TOTAL** | | **~R$ 210/mês** |

**Benefícios:**
- Backend sempre ativo
- 100.000 e-mails/mês
- Domínio personalizado
- Suporte técnico

---

## 🎯 Próximos Passos

Após o deploy:

1. **Domínio Customizado**
   - Compre um domínio (Registro.br, GoDaddy, etc.)
   - Configure no Vercel e Render

2. **Analytics**
   - Google Analytics
   - Hotjar (mapas de calor)

3. **Segurança**
   - Rate limiting
   - Captcha no formulário

4. **Backup**
   - Exportar dados regularmente
   - Backup do banco de dados

---

**Deploy concluído! Seu site está no ar! 🎉**

Compartilhe a URL e comece a receber inscrições!

