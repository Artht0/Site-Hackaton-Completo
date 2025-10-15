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
  origin: [
    'https://site-hackaton-completo.vercel.app',
    'https://site-hackaton-completo-git-main.vercel.app', 
    'http://localhost:3000',
    'http://localhost:5173'
  ],
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
  
  // Mensagem amigável sobre configuração de e-mail
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log(`📧 E-mail configurado: ${process.env.EMAIL_USER}`)
    console.log(`✅ Sistema funcionando com envio automático de e-mails`)
  } else {
    console.log(`⚠️  E-mail não configurado`)
    console.log(`✅ Sistema funcionando normalmente (sem envio de e-mails)`)
    console.log(`💾 Todas as inscrições serão salvas em: data/inscricoes.json`)
  }
})

