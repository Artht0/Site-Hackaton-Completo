# 🧪 Guia de Testes

Este guia ajuda você a testar o sistema localmente antes do deploy.

## 📋 Pré-requisitos para Testes

- [ ] Node.js instalado
- [ ] Backend rodando (`npm start` na pasta backend)
- [ ] Frontend rodando (`npm run dev` na pasta frontend)
- [ ] E-mail configurado no `.env`

---

## 1️⃣ Testes do Backend

### Teste 1: Health Check

**Objetivo:** Verificar se o servidor está rodando

```bash
# No navegador ou com curl
curl http://localhost:5000/
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "message": "API do Hackathon Escolar 2025 está funcionando!"
}
```

---

### Teste 2: Criar Inscrição (POST)

**Objetivo:** Testar criação de inscrição e envio de e-mail

**Com curl:**
```bash
curl -X POST http://localhost:5000/api/inscricoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João da Silva",
    "cpf": "123.456.789-00",
    "email": "seu-email@gmail.com",
    "oficina": "Oficina 1 – Robótica Criativa"
  }'
```

**Com Postman/Insomnia:**
- **Método:** POST
- **URL:** http://localhost:5000/api/inscricoes
- **Headers:** Content-Type: application/json
- **Body (JSON):**
  ```json
  {
    "nome": "João da Silva",
    "cpf": "123.456.789-00",
    "email": "seu-email@gmail.com",
    "oficina": "Oficina 1 – Robótica Criativa"
  }
  ```

**Resultado esperado:**
```json
{
  "status": "ok",
  "message": "Inscrição salva e e-mail enviado com sucesso!",
  "inscricao": {
    "id": 1697123456789,
    "nome": "João da Silva",
    "oficina": "Oficina 1 – Robótica Criativa"
  }
}
```

**Verificações:**
- ✅ Status 201 Created
- ✅ Console do backend mostra "E-mail enviado com sucesso"
- ✅ Arquivo `backend/data/inscricoes.json` foi criado
- ✅ E-mail chegou na caixa de entrada

---

### Teste 3: Listar Inscrições (GET)

**Objetivo:** Verificar listagem de inscrições

```bash
curl http://localhost:5000/api/inscricoes
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "total": 1,
  "inscricoes": [
    {
      "id": 1697123456789,
      "nome": "João da Silva",
      "oficina": "Oficina 1 – Robótica Criativa",
      "dataInscricao": "2025-10-14T10:00:00.000Z"
    }
  ]
}
```

**Observações:**
- CPF e e-mail NÃO aparecem (dados sensíveis removidos)

---

### Teste 4: Validações

#### 4.1 CPF Inválido

```bash
curl -X POST http://localhost:5000/api/inscricoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "cpf": "123",
    "email": "maria@email.com",
    "oficina": "Oficina 2 – Design Thinking"
  }'
```

**Resultado esperado:**
```json
{
  "status": "error",
  "message": "Preencha todos os campos corretamente.",
  "errors": [...]
}
```

#### 4.2 E-mail Inválido

```bash
curl -X POST http://localhost:5000/api/inscricoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pedro Costa",
    "cpf": "123.456.789-00",
    "email": "email-invalido",
    "oficina": "Oficina 3 – Programação Web"
  }'
```

**Resultado esperado:** Erro de validação

#### 4.3 CPF Duplicado

Tente cadastrar o mesmo CPF duas vezes.

**Resultado esperado:**
```json
{
  "status": "error",
  "message": "CPF ou e-mail já cadastrado."
}
```

---

## 2️⃣ Testes do Frontend

### Teste 1: Página Inicial

1. Acesse http://localhost:3000
2. Verifique:
   - ✅ Título "Hackathon Escolar 2025" aparece
   - ✅ Descrição do evento aparece
   - ✅ Ícones e cards aparecem
   - ✅ Botão "Inscreva-se Agora" está visível
   - ✅ Animações funcionam (fade-in)
   - ✅ Layout responsivo (teste redimensionando)

### Teste 2: Navegação

1. Clique em "Inscreva-se Agora"
2. Verifique:
   - ✅ Redireciona para `/inscricao`
   - ✅ Botão "Voltar" aparece
   - ✅ Formulário carrega completo

### Teste 3: Formulário de Inscrição

#### 3.1 Campos Básicos

1. Digite um nome: "Ana Silva"
2. Verifique: ✅ Campo aceita texto normalmente

#### 3.2 Campo CPF

1. Digite: "12345678900"
2. Verifique: ✅ Formatação automática para "123.456.789-00"
3. Teste limitar a 11 dígitos

#### 3.3 Campo E-mail

1. Digite: "ana@email.com"
2. Verifique: ✅ Campo aceita e-mail válido

#### 3.4 Seleção de Oficina

1. Clique em uma oficina
2. Verifique:
   - ✅ Oficina fica destacada (borda ou check)
   - ✅ Animação de hover funciona
   - ✅ Só uma oficina pode ser selecionada por vez
3. Clique em outra oficina
4. Verifique: ✅ Primeira oficina é desmarcada

#### 3.5 Termo de Responsabilidade

1. Clique no link "termos de responsabilidade"
2. Verifique:
   - ✅ Modal abre com fundo escuro
   - ✅ Texto do termo aparece completo
   - ✅ Scroll funciona no modal
   - ✅ Botão "Fechar" funciona
   - ✅ Clicar fora do modal fecha
3. Marque o checkbox
4. Verifique: ✅ Checkbox fica marcado

#### 3.6 Botão Enviar

**Teste com campos vazios:**
1. Não preencha nada
2. Verifique: ✅ Botão está desabilitado (cinza)

**Teste com dados parciais:**
1. Preencha apenas o nome
2. Verifique: ✅ Botão continua desabilitado

**Teste com todos os dados:**
1. Preencha todos os campos
2. Marque o termo
3. Verifique: ✅ Botão fica habilitado (colorido)
4. Clique no botão
5. Verifique:
   - ✅ Botão mostra "Enviando..."
   - ✅ Spinner de loading aparece
   - ✅ Mensagem de sucesso aparece (verde)
   - ✅ Formulário é resetado
   - ✅ Redireciona para home após 3 segundos

---

### Teste 4: Validações no Frontend

#### 4.1 CPF Inválido

1. Digite: "123"
2. Tente enviar
3. Verifique: ✅ Botão continua desabilitado

#### 4.2 E-mail Inválido

1. Digite: "email-invalido"
2. Tente enviar
3. Verifique: ✅ Botão continua desabilitado

---

### Teste 5: Responsividade

**Desktop (1920x1080):**
- ✅ Layout em duas colunas
- ✅ Cards lado a lado
- ✅ Espaçamentos adequados

**Tablet (768x1024):**
- ✅ Layout ajusta
- ✅ Oficinas em grade 2x3
- ✅ Botões legíveis

**Mobile (375x667):**
- ✅ Layout em coluna única
- ✅ Oficinas em grade 2xN
- ✅ Texto legível
- ✅ Botões tocáveis (min 44x44px)

**Como testar:**
1. Abra DevTools (F12)
2. Clique no ícone de dispositivo móvel
3. Teste diferentes resoluções

---

### Teste 6: Animações

1. Recarregue a página inicial
2. Verifique:
   - ✅ Conteúdo aparece com fade-in
   - ✅ Cards têm efeito hover (escala)
   - ✅ Botão principal tem efeito hover (gradiente)

3. Vá para página de inscrição
4. Verifique:
   - ✅ Formulário aparece com slide-up
   - ✅ Oficinas têm hover smooth
   - ✅ Oficina selecionada tem transição

---

## 3️⃣ Testes de Integração

### Teste Completo End-to-End

1. ✅ Acesse homepage
2. ✅ Clique "Inscreva-se Agora"
3. ✅ Preencha o formulário:
   - Nome: "Teste da Silva"
   - CPF: "123.456.789-00"
   - E-mail: seu-email-real@gmail.com
   - Oficina: qualquer uma
4. ✅ Aceite o termo
5. ✅ Clique "Enviar Inscrição"
6. ✅ Aguarde mensagem de sucesso
7. ✅ Verifique seu e-mail
8. ✅ Abra http://localhost:5000/api/inscricoes
9. ✅ Veja sua inscrição na lista

---

## 4️⃣ Testes de Performance

### Frontend

**Lighthouse (Chrome DevTools):**
1. Abra DevTools (F12)
2. Vá em "Lighthouse"
3. Clique "Analyze page load"
4. Metas:
   - Performance: > 90
   - Accessibility: > 95
   - Best Practices: > 90
   - SEO: > 90

### Backend

**Tempo de Resposta:**

```bash
time curl http://localhost:5000/api/inscricoes
```

Meta: < 100ms

---

## 5️⃣ Testes de Segurança

### SQL Injection (não aplicável - JSON file)

### XSS (Cross-Site Scripting)

Tente cadastrar:
```
Nome: <script>alert('XSS')</script>
```

Verifique: ✅ Script não é executado

### CORS

Do console do navegador em outro domínio:
```javascript
fetch('http://localhost:5000/api/inscricoes')
  .then(r => r.json())
  .then(console.log)
```

Verifique: ✅ Request é permitido (CORS configurado)

---

## 6️⃣ Checklist Final

Antes de fazer deploy, confirme:

**Backend:**
- [ ] Health check funciona
- [ ] POST cria inscrições
- [ ] GET lista inscrições
- [ ] Validações funcionam
- [ ] E-mails são enviados
- [ ] Duplicatas são rejeitadas
- [ ] Logs aparecem no console

**Frontend:**
- [ ] Homepage carrega
- [ ] Navegação funciona
- [ ] Formulário completo
- [ ] Validações funcionam
- [ ] Oficinas selecionáveis
- [ ] Modal do termo abre/fecha
- [ ] Feedback de sucesso/erro
- [ ] Responsivo (mobile/tablet/desktop)

**Integração:**
- [ ] Frontend conecta com backend
- [ ] CORS funciona
- [ ] E-mail é recebido
- [ ] Dados são salvos

---

## 🐛 Problemas Comuns nos Testes

### "Network Error" no frontend

**Causa:** Backend não está rodando

**Solução:**
```bash
cd backend
npm start
```

### "CORS Error"

**Causa:** Frontend e backend em portas diferentes

**Solução:** Já está configurado. Verifique se o backend está rodando.

### E-mail não chega

**Causa:** Configuração de e-mail incorreta

**Solução:** Verifique o arquivo `.env` e os logs do backend

### Botão não habilita

**Causa:** Validação está funcionando

**Solução:** Preencha todos os campos corretamente

---

## 📊 Relatório de Testes

Após testar, preencha:

| Teste | Status | Observações |
|-------|--------|-------------|
| Backend Health Check | ✅ / ❌ | |
| POST Inscrição | ✅ / ❌ | |
| GET Inscrições | ✅ / ❌ | |
| Validações Backend | ✅ / ❌ | |
| Frontend Homepage | ✅ / ❌ | |
| Frontend Formulário | ✅ / ❌ | |
| Seleção de Oficinas | ✅ / ❌ | |
| Envio de E-mail | ✅ / ❌ | |
| Responsividade | ✅ / ❌ | |
| Performance | ✅ / ❌ | |

---

**Todos os testes passaram? Parabéns! 🎉**

Você está pronto para fazer deploy!

