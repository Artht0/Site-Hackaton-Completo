import express from 'express'
import { body, validationResult } from 'express-validator'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { enviarEmail } from '../utils/emailService.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_FILE = path.join(__dirname, '../data/inscricoes.json')

// Garantir que o diretório e arquivo existem
async function inicializarArquivo() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify([]))
  }
}

// Validação de CPF básica
function validarCPF(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, '')
  return cpfLimpo.length === 11
}

// POST - Criar nova inscrição
router.post('/', [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('cpf').custom((value) => {
    if (!validarCPF(value)) {
      throw new Error('CPF inválido')
    }
    return true
  }),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('oficina').notEmpty().withMessage('Oficina é obrigatória')
], async (req, res) => {
  try {
    console.log('📥 Nova requisição de inscrição recebida:', req.body)
    console.log('🌐 Origin:', req.headers.origin)
    console.log('🔗 Headers:', req.headers)
    
    // Validar campos
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Preencha todos os campos corretamente.',
        errors: errors.array() 
      })
    }

    const { nome, cpf, email, oficina } = req.body

    // Inicializar arquivo se não existir
    await inicializarArquivo()

    // Ler inscrições existentes
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    const inscricoes = JSON.parse(data)

    // Verificar se já está inscrito na MESMA oficina/desafio
    const jaInscritoNaOficina = inscricoes.find(
      i => (i.cpf === cpf || i.email.toLowerCase() === email.toLowerCase()) && i.oficina === oficina
    )
    
    if (jaInscritoNaOficina) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Você já está inscrito nesta oficina/desafio.' 
      })
    }

    // Criar nova inscrição
    const novaInscricao = {
      id: Date.now(),
      nome: nome.trim(),
      cpf,
      email: email.toLowerCase().trim(),
      oficina,
      dataInscricao: new Date().toISOString()
    }

    // Salvar inscrição
    inscricoes.push(novaInscricao)
    await fs.writeFile(DATA_FILE, JSON.stringify(inscricoes, null, 2))

    // Tentar enviar e-mail de confirmação (opcional)
    let emailEnviado = false
    try {
      await enviarEmail({
        destinatario: email,
        nome,
        oficina
      })
      emailEnviado = true
      console.log('✅ E-mail enviado com sucesso para:', email)
    } catch (emailError) {
      console.warn('⚠️  E-mail não enviado (configuração desabilitada ou erro)')
      console.warn('   Inscrição salva normalmente em:', DATA_FILE)
      // Não retorna erro - o sistema continua funcionando
    }

    res.status(201).json({ 
      status: 'ok', 
      message: emailEnviado 
        ? 'Inscrição salva e e-mail enviado com sucesso!'
        : 'Inscrição salva com sucesso!',
      inscricao: {
        id: novaInscricao.id,
        nome: novaInscricao.nome,
        oficina: novaInscricao.oficina
      }
    })

  } catch (error) {
    console.error('Erro ao processar inscrição:', error)
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao processar inscrição. Tente novamente.' 
    })
  }
})

// GET - Listar todas as inscrições (sem dados sensíveis)
router.get('/', async (req, res) => {
  try {
    await inicializarArquivo()
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    const inscricoes = JSON.parse(data)

    // Remover informações sensíveis na listagem pública
    const inscricoesPublicas = inscricoes.map(({ cpf, email, ...resto }) => resto)

    res.json({ 
      status: 'ok', 
      total: inscricoes.length,
      inscricoes: inscricoesPublicas 
    })
  } catch (error) {
    console.error('Erro ao listar inscrições:', error)
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao listar inscrições.' 
    })
  }
})

// GET - Listar TODAS as inscrições com dados completos (ADMIN)
// Acesse: http://localhost:5000/api/inscricoes/admin/completo
router.get('/admin/completo', async (req, res) => {
  try {
    await inicializarArquivo()
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    const inscricoes = JSON.parse(data)

    // Retorna TODOS os dados, incluindo CPF e e-mail
    res.json({ 
      status: 'ok', 
      total: inscricoes.length,
      inscricoes: inscricoes,
      aviso: 'Esta rota contém dados sensíveis (CPF e e-mail). Use com cuidado!'
    })
  } catch (error) {
    console.error('Erro ao listar inscrições completas:', error)
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao listar inscrições.' 
    })
  }
})

export default router

