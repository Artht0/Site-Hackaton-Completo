# 🚀 Instruções de Deploy no Render - Passo a Passo

## ✅ Passo 1: Preparar o Repositório GitHub

Primeiro, certifique-se de que todo o código está no GitHub:

```bash
git add .
git commit -m "Preparar para deploy do backend"
git push
```

---

## ✅ Passo 2: Criar Conta no Render

1. Acesse: **https://render.com**
2. Clique em **"Get Started"** ou **"Sign Up"**
3. Escolha **"Sign in with GitHub"** (mais fácil)
4. Autorize o Render a acessar seus repositórios

---

## ✅ Passo 3: Criar Novo Web Service

1. No dashboard do Render, clique no botão **"New +"** (canto superior direito)
2. Selecione **"Web Service"**
3. Você verá uma lista dos seus repositórios do GitHub
4. Encontre o repositório **"Site Hackaton"** e clique em **"Connect"**

---

## ✅ Passo 4: Configurar o Serviço

Preencha os campos com estas informações:

### Informações Básicas:
- **Name:** `open-doors-backend` (ou qualquer nome que preferir)
- **Region:** `Oregon (US West)` ou escolha o mais próximo
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`

### Comandos:
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Plano:
- Selecione **"Free"** (plano gratuito)

---

## ✅ Passo 5: Configurar Variáveis de Ambiente

Role a página para baixo até encontrar **"Environment Variables"**.

Clique em **"Add Environment Variable"** e adicione as seguintes variáveis:

### OBRIGATÓRIAS:

1. **Variável 1:**
   - Key: `PORT`
   - Value: `5000`

2. **Variável 2:**
   - Key: `NODE_VERSION`
   - Value: `18.0.0`

3. **Variável 3:**
   - Key: `FRONTEND_URL`
   - Value: `https://seu-site.vercel.app` (cole a URL do seu site no Vercel aqui)

### OPCIONAIS (somente se quiser enviar e-mails):

Se você **NÃO** quiser configurar e-mail agora, pule estas etapas. O sistema funcionará normalmente sem e-mails.

4. **Variável 4 (opcional):**
   - Key: `EMAIL_SERVICE`
   - Value: `gmail`

5. **Variável 5 (opcional):**
   - Key: `EMAIL_USER`
   - Value: `seu-email@gmail.com`

6. **Variável 6 (opcional):**
   - Key: `EMAIL_PASS`
   - Value: `sua-senha-de-app` (senha de app do Gmail, NÃO sua senha normal)

**Como gerar senha de app do Gmail:**
- Acesse: https://myaccount.google.com/security
- Ative "Verificação em duas etapas"
- Procure "Senhas de app"
- Gere uma senha para "E-mail"
- Use essa senha aqui

---

## ✅ Passo 6: Fazer Deploy

1. Revise todas as configurações
2. Clique no botão **"Create Web Service"** no final da página
3. **AGUARDE** - O deploy pode levar de 5 a 10 minutos
4. Você verá os logs aparecendo na tela

### ✅ Sinais de Sucesso:
Procure por estas mensagens nos logs:
```
Build successful
Service is live
🚀 Servidor rodando na porta 5000
```

---

## ✅ Passo 7: Copiar a URL do Backend

1. Quando o deploy terminar, você verá **"Your service is live 🎉"**
2. No topo da página, você verá a URL do seu backend
3. Será algo como: **`https://open-doors-backend.onrender.com`**
4. **COPIE ESTA URL** - você vai precisar dela!

---

## ✅ Passo 8: Testar o Backend

Abra a URL no navegador: `https://open-doors-backend.onrender.com`

Você deve ver:
```json
{
  "status": "ok",
  "message": "API do Open Doors Simetria 2025 está funcionando!"
}
```

Se viu essa mensagem, **PARABÉNS!** Seu backend está no ar! 🎉

---

## 📝 Próximo Passo

**Me envie a URL do backend** (ex: `https://open-doors-backend.onrender.com`)

Eu vou configurar o frontend para se conectar com ele!

---

## ⚠️ Solução de Problemas

### Se o deploy falhar:

1. **Verifique o Root Directory:** Deve ser `backend`
2. **Verifique os logs:** Procure por mensagens de erro em vermelho
3. **Build Command deve ser:** `npm install`
4. **Start Command deve ser:** `npm start`

### Se aparecer "Application Error":

1. Vá em "Logs" e procure por erros
2. Verifique se todas as variáveis de ambiente estão corretas
3. Tente fazer "Manual Deploy" de novo

### O deploy está demorando muito:

- É normal! O plano gratuito pode levar até 10-15 minutos
- Seja paciente, aguarde os logs

---

## 💡 Dicas

- O plano gratuito do Render "dorme" após 15 minutos sem uso
- Quando alguém acessar, pode demorar 30 segundos para "acordar"
- Isso é normal no plano gratuito
- Para produção séria, considere o plano pago ($7/mês)

---

**Após copiar a URL, me envie para eu configurar o frontend!** 🚀

