# 📊 Como Acessar os Dados dos Inscritos

Guia completo para visualizar e exportar os dados das inscrições do Open Doors Simetria.

---

## 🎯 Sistema Funcionando sem E-mail

✅ **Boa notícia:** O sistema **NÃO precisa** de e-mail configurado para funcionar!

Todas as inscrições são salvas automaticamente em:
```
backend/data/inscricoes.json
```

Se o e-mail estiver configurado: envia e-mail ✅  
Se o e-mail NÃO estiver configurado: apenas salva os dados ✅

**Ambos os casos funcionam perfeitamente!**

---

## 📁 Opção 1: Ver Diretamente no Arquivo

### Localização:
```
backend/data/inscricoes.json
```

### Como abrir:
1. Navegue até a pasta `backend/data/`
2. Abra o arquivo `inscricoes.json` com qualquer editor de texto
3. Você verá algo assim:

```json
[
  {
    "id": 1734567890123,
    "nome": "João Silva Santos",
    "cpf": "123.456.789-00",
    "email": "joao@email.com",
    "oficina": "Oficina 1 – Robótica Criativa",
    "dataInscricao": "2025-10-14T15:30:00.000Z"
  },
  {
    "id": 1734567891234,
    "nome": "Maria Costa",
    "cpf": "987.654.321-00",
    "email": "maria@email.com",
    "oficina": "Oficina 3 – Programação Web",
    "dataInscricao": "2025-10-14T16:45:00.000Z"
  }
]
```

---

## 🌐 Opção 2: Ver via Navegador (API)

### Rota Pública (sem CPF e e-mail):
```
http://localhost:5000/api/inscricoes
```

**Retorna:**
```json
{
  "status": "ok",
  "total": 2,
  "inscricoes": [
    {
      "id": 1734567890123,
      "nome": "João Silva Santos",
      "oficina": "Oficina 1 – Robótica Criativa",
      "dataInscricao": "2025-10-14T15:30:00.000Z"
    }
  ]
}
```

### Rota Admin (COM CPF e e-mail):
```
http://localhost:5000/api/inscricoes/admin/completo
```

**Retorna TODOS os dados:**
```json
{
  "status": "ok",
  "total": 2,
  "inscricoes": [
    {
      "id": 1734567890123,
      "nome": "João Silva Santos",
      "cpf": "123.456.789-00",
      "email": "joao@email.com",
      "oficina": "Oficina 1 – Robótica Criativa",
      "dataInscricao": "2025-10-14T15:30:00.000Z"
    }
  ],
  "aviso": "Esta rota contém dados sensíveis (CPF e e-mail). Use com cuidado!"
}
```

---

## 📥 Opção 3: Exportar para Excel

### Método 1: Converter Online

1. Abra o arquivo `backend/data/inscricoes.json`
2. Copie TODO o conteúdo (CTRL+A, CTRL+C)
3. Acesse: https://www.convertcsv.com/json-to-csv.htm
4. Cole o JSON na caixa de texto
5. Clique em **"Convert JSON to CSV"**
6. Clique em **"Download Result"**
7. Abra o arquivo `.csv` no Excel ou Google Sheets

### Método 2: Usar API + Copiar/Colar

1. Acesse: `http://localhost:5000/api/inscricoes/admin/completo`
2. Copie todo o JSON
3. Use o conversor online (link acima)
4. Baixe o CSV

---

## 💾 Backup dos Dados

### Backup Manual:

Simplesmente **copie** o arquivo:
```
backend/data/inscricoes.json
```

Para um local seguro (USB, nuvem, etc.)

### Backup Automático (Script):

Crie um arquivo `backup.bat` (Windows) ou `backup.sh` (Linux/Mac):

**Windows (backup.bat):**
```batch
@echo off
set data=%date:~-4%%date:~3,2%%date:~0,2%
copy backend\data\inscricoes.json backups\inscricoes_%data%.json
echo Backup criado: backups\inscricoes_%data%.json
```

**Linux/Mac (backup.sh):**
```bash
#!/bin/bash
data=$(date +%Y%m%d_%H%M%S)
cp backend/data/inscricoes.json backups/inscricoes_$data.json
echo "Backup criado: backups/inscricoes_$data.json"
```

Execute periodicamente para manter cópias de segurança!

---

## 📊 Opção 4: Ver com Ferramentas

### Postman / Insomnia:

1. Abra o Postman ou Insomnia
2. Crie uma requisição GET
3. URL: `http://localhost:5000/api/inscricoes/admin/completo`
4. Envie
5. Visualize os dados formatados

### Thunder Client (VS Code):

1. Instale a extensão "Thunder Client"
2. Crie nova requisição GET
3. URL: `http://localhost:5000/api/inscricoes/admin/completo`
4. Send
5. Visualize os dados

---

## 🔍 Filtrar/Buscar Inscritos

Se quiser buscar um inscrito específico, você pode:

### No navegador (CTRL+F):
1. Acesse `http://localhost:5000/api/inscricoes/admin/completo`
2. Pressione CTRL+F
3. Digite o nome, CPF ou oficina
4. Navegue pelos resultados

### No arquivo JSON:
1. Abra `backend/data/inscricoes.json` no VS Code
2. Use CTRL+F para buscar

---

## 📈 Estatísticas Rápidas

### Total de Inscrições:

Acesse qualquer uma das rotas e veja o campo `"total"`:
```json
{
  "total": 15
}
```

### Inscrições por Oficina:

Abra o arquivo JSON e conte manualmente, ou use esta técnica:

1. Abra o arquivo no VS Code
2. Use CTRL+F
3. Busque por "Oficina 1" e veja quantas ocorrências
4. Repita para cada oficina

---

## 📋 Estrutura de Cada Inscrição

```json
{
  "id": 1734567890123,           // ID único (timestamp)
  "nome": "João Silva",          // Nome completo
  "cpf": "123.456.789-00",       // CPF formatado
  "email": "joao@email.com",     // E-mail
  "oficina": "Oficina 1 – ...",  // Oficina escolhida
  "dataInscricao": "2025-10-14T15:30:00.000Z"  // Data/hora
}
```

---

## 🚨 Importante - Segurança

### Rota Pública:
`/api/inscricoes` → **Não mostra** CPF e e-mail (seguro para compartilhar)

### Rota Admin:
`/api/inscricoes/admin/completo` → **Mostra tudo** (use com cuidado!)

**⚠️ Nunca compartilhe a rota admin publicamente!**

---

## 🔄 Atualização em Tempo Real

Os dados são salvos **instantaneamente** quando alguém se inscreve.

Para ver atualizações:
- **No arquivo:** Reabra o arquivo JSON
- **No navegador:** Atualize a página (F5)
- **Na API:** Faça uma nova requisição

---

## 💡 Dicas Úteis

1. **Faça backup regular** do arquivo `inscricoes.json`
2. **Não delete** o arquivo por engano - ele contém todos os dados!
3. **Use a rota admin** apenas localmente (localhost)
4. **Exporte para Excel** antes de fazer análises complexas
5. **Mantenha cópias** em diferentes locais (USB, nuvem, e-mail)

---

## 🎯 Resumo Rápido

| O que você quer | Como fazer |
|-----------------|------------|
| Ver todos os dados | Abrir `backend/data/inscricoes.json` |
| Ver no navegador | Acessar `http://localhost:5000/api/inscricoes/admin/completo` |
| Exportar para Excel | Copiar JSON → Converter em https://www.convertcsv.com/json-to-csv.htm |
| Fazer backup | Copiar `inscricoes.json` para local seguro |
| Ver total | Qualquer rota mostra o campo `"total"` |

---

**Todas as inscrições estão salvas e seguras!** 🎉

Não importa se o e-mail está configurado ou não - seus dados estão sendo salvos corretamente em `backend/data/inscricoes.json`.

