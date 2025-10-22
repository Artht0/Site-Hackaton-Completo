# 🚀 Início Rápido - Open Doors Simetria 2025

## ✅ Sistema CORRIGIDO e FUNCIONAL

O sistema de inscrições está totalmente funcional! Os erros foram corrigidos.

### O que foi corrigido:
1. ✅ Instaladas todas as dependências do backend
2. ✅ Instaladas todas as dependências do frontend  
3. ✅ Criado arquivo de dados (inscricoes.json)
4. ✅ Backend testado e funcionando
5. ✅ Sistema de inscrição testado e salvando dados

---

## 🎯 Como Usar

### Opção 1: Script Automático (RECOMENDADO)
```bash
./start.sh
```

### Opção 2: Manual

**1. Iniciar Backend:**
```bash
cd backend
PORT=5000 node server.js
```

**2. Em outro terminal, iniciar Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Ver todas inscrições:** http://localhost:5000/api/inscricoes/admin/completo

---

## 🧪 Testar Inscrição

```bash
curl -X POST http://localhost:5000/api/inscricoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste da Silva",
    "cpf": "123.456.789-00",
    "email": "teste@example.com",
    "oficina": "IA/Programação"
  }'
```

---

## 📊 Ver Dados Salvos

```bash
cat backend/data/inscricoes.json
```

Ou via API:
```bash
curl http://localhost:5000/api/inscricoes/admin/completo
```

---

## 🛑 Parar os Servidores

```bash
pkill -f 'node.*server.js'
pkill -f 'vite'
```

---

## 📝 Oficinas Disponíveis

1. 🤖 IA/Programação
2. 🧪 Química
3. 🎨 Artes
4. ✍️ Redação

---

## ✅ Status

- [x] Backend funcionando
- [x] Frontend funcionando
- [x] Sistema de inscrição operacional
- [x] Salvamento de dados funcionando
- [x] Validações ativas

**TUDO PRONTO PARA USO!** 🎉

