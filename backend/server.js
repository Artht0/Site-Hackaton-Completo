import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import inscricoesRouter from './routes/inscricoes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: true, // Aceita qualquer origem durante desenvolvimento
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/api/inscricoes', inscricoesRouter)

// Rota de health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API do Open Doors Simetria 2025 está funcionando!' 
  })
})

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    status: 'error', 
    message: 'Erro interno do servidor' 
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`✅ Sistema funcionando - inscrições salvas em: data/inscricoes.json`)
})

