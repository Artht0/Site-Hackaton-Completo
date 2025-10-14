# 📧 Guia de Configuração de E-mail

Este guia detalha como configurar o envio de e-mails para diferentes provedores.

## 🔵 Gmail (Recomendado)

### Passo a Passo Completo

1. **Ative a Verificação em Duas Etapas**
   - Acesse: https://myaccount.google.com/security
   - Encontre "Verificação em duas etapas"
   - Clique em "Começar" e siga as instruções

2. **Gere uma Senha de App**
   - Ainda em Segurança, procure por "Senhas de app"
   - Pode ser necessário fazer login novamente
   - Selecione:
     - **App:** E-mail
     - **Dispositivo:** Computador Windows/Mac/Linux
   - Clique em "Gerar"
   - Copie a senha de 16 caracteres gerada

3. **Configure o .env**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```
   > **Importante:** Use a senha de app, não sua senha normal!

### Solução de Problemas

**❌ "Invalid login"**
- Certifique-se de usar a senha de app, não sua senha normal
- Verifique se a verificação em 2 etapas está ativada

**❌ "Less secure app access"**
- O Gmail não permite mais apps "menos seguros"
- Você DEVE usar senhas de app

---

## 🟦 Outlook / Hotmail

```env
EMAIL_SERVICE=hotmail
EMAIL_USER=seu-email@outlook.com
EMAIL_PASS=sua-senha-normal
```

> **Nota:** O Outlook permite usar a senha normal da conta.

---

## 🟣 Yahoo Mail

1. Gere uma senha de app:
   - Acesse: https://login.yahoo.com/myaccount/security/
   - Procure "Generate app password"

2. Configure:
   ```env
   EMAIL_SERVICE=yahoo
   EMAIL_USER=seu-email@yahoo.com
   EMAIL_PASS=senha-de-app-gerada
   ```

---

## 🔧 Outros Provedores (SMTP Customizado)

Se você usa outro provedor, configure manualmente no arquivo `backend/utils/emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.seudominio.com',
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
```

### Configurações Comuns:

| Provedor | Host SMTP | Porta | SSL/TLS |
|----------|-----------|-------|---------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| SendGrid | smtp.sendgrid.net | 587 | TLS |
| Mailgun | smtp.mailgun.org | 587 | TLS |

---

## 🧪 Testar Configuração

Após configurar, teste com:

```bash
cd backend
npm start
```

Faça uma inscrição de teste e verifique:
1. ✅ Console do backend mostra "E-mail enviado com sucesso"
2. ✅ E-mail chegou na caixa de entrada
3. ✅ E-mail não foi para spam

---

## 🚨 Problemas Comuns

### E-mails vão para SPAM

**Soluções:**
- Use um domínio próprio (não @gmail.com para envios)
- Configure SPF, DKIM e DMARC no seu domínio
- Use serviços profissionais: SendGrid, Mailgun, AWS SES

### "Connection timeout"

**Soluções:**
- Verifique se sua rede bloqueia a porta 587
- Teste usar porta 465 (SSL) em vez de 587 (TLS)
- Verifique firewall

### E-mails não chegam

**Soluções:**
- Verifique a pasta de spam
- Confira os logs do backend para erros
- Teste com um e-mail diferente
- Verifique se o provedor tem limite de envios

---

## 🎯 Serviços Profissionais Recomendados

Para produção, considere usar:

### SendGrid (Recomendado)
- ✅ 100 e-mails/dia grátis
- ✅ Fácil configuração
- ✅ Analytics detalhado
- 🔗 https://sendgrid.com/

### Mailgun
- ✅ 5.000 e-mails/mês grátis
- ✅ API simples
- 🔗 https://www.mailgun.com/

### AWS SES
- ✅ Muito barato
- ✅ Escalável
- ⚠️ Configuração mais complexa
- 🔗 https://aws.amazon.com/ses/

---

## 📝 Exemplo de Configuração com SendGrid

1. Crie uma conta no SendGrid
2. Gere uma API Key
3. Configure no `.env`:

```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxx
```

4. Atualize o `emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.EMAIL_PASS
  }
})
```

---

**Dúvidas? Consulte a documentação oficial do Nodemailer:**
https://nodemailer.com/about/

