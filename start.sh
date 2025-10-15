#!/bin/bash

echo "🚀 Iniciando Open Doors Simetria 2025..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se as dependências estão instaladas
echo -e "${BLUE}📦 Verificando dependências...${NC}"

if [ ! -d "backend/node_modules" ]; then
  echo "Instalando dependências do backend..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Instalando dependências do frontend..."
  cd frontend && npm install && cd ..
fi

# Criar arquivo de dados se não existir
if [ ! -f "backend/data/inscricoes.json" ]; then
  echo "[]" > backend/data/inscricoes.json
fi

echo -e "${GREEN}✅ Dependências verificadas!${NC}"
echo ""

# Matar processos anteriores
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 1

# Iniciar backend
echo -e "${BLUE}🔧 Iniciando backend na porta 5000...${NC}"
cd backend
PORT=5000 node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 2

# Verificar se backend iniciou
if curl -s http://localhost:5000/ > /dev/null; then
  echo -e "${GREEN}✅ Backend rodando em http://localhost:5000${NC}"
else
  echo "❌ Erro ao iniciar backend. Verifique os logs em /tmp/backend.log"
  exit 1
fi

# Iniciar frontend
echo -e "${BLUE}🎨 Iniciando frontend...${NC}"
cd frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo -e "${GREEN}✅ Sistema iniciado com sucesso!${NC}"
echo ""
echo "📍 URLs:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:5173 (ou verifique o log)"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 Para parar os servidores:"
echo "   pkill -f 'node.*server.js'"
echo "   pkill -f 'vite'"
echo ""

