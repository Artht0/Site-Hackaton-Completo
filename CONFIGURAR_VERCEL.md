# 🔧 Configurar Vercel com Backend em Produção

Este arquivo será usado quando você me passar a URL do backend.

## Passo 1: Acessar Dashboard do Vercel

1. Vá para: **https://vercel.com**
2. Faça login
3. Encontre seu projeto no dashboard

## Passo 2: Adicionar Variável de Ambiente

1. Clique no projeto
2. Vá em **"Settings"** (aba superior)
3. No menu lateral, clique em **"Environment Variables"**
4. Clique em **"Add New"** ou **"Add"**

## Passo 3: Configurar Variável

Adicione esta variável:

- **Name (Key):** `VITE_API_URL`
- **Value:** Cole a URL do backend aqui (ex: `https://open-doors-backend.onrender.com`)
- **Environment:** Selecione **Production**, **Preview** e **Development**

Clique em **"Save"**

## Passo 4: Fazer Redeploy

1. Vá em **"Deployments"** (aba superior)
2. Encontre o último deployment (primeiro da lista)
3. Clique nos **três pontinhos (...)** do lado direito
4. Selecione **"Redeploy"**
5. Clique em **"Redeploy"** novamente para confirmar
6. Aguarde 1-2 minutos

## Passo 5: Testar

1. Acesse seu site no Vercel
2. Tente fazer uma inscrição
3. ✅ Deve funcionar!

---

**Ou posso te guiar no passo a passo quando você me passar a URL do backend!**

