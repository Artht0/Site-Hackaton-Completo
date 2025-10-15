import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import TermoModal from '../components/TermoModal'

const desafios = [
  { 
    id: 1, 
    nome: 'Educação Infantil', 
    titulo: 'Deu praia!',
    cor: 'from-cyan-500 to-blue-600', 
    emoji: '🏖️',
    descricao: 'Explore elementos da praia e do mar através de atividades lúdicas e criativas, desenvolvendo habilidades motoras e sensoriais.'
  },
  { 
    id: 2, 
    nome: '1° e 2° Anos', 
    titulo: 'Folclore com argila',
    cor: 'from-orange-500 to-red-600', 
    emoji: '🎭',
    descricao: 'Conheça personagens do folclore brasileiro e crie suas próprias esculturas de argila, explorando nossa cultura popular.'
  },
  { 
    id: 3, 
    nome: '3° Ano', 
    titulo: 'Construindo uma cidade',
    cor: 'from-green-500 to-teal-600', 
    emoji: '🏙️',
    descricao: 'Planeje e construa uma cidade em miniatura, aprendendo sobre urbanismo, sustentabilidade e organização espacial.'
  },
  { 
    id: 4, 
    nome: '4° Ano', 
    titulo: 'Iluminando uma cidade',
    cor: 'from-yellow-500 to-orange-600', 
    emoji: '💡',
    descricao: 'Descubra os princípios da eletricidade e circuitos criando sistemas de iluminação para maquetes de cidades.'
  },
  { 
    id: 5, 
    nome: '5° Ano', 
    titulo: 'Robótica e programação',
    cor: 'from-indigo-500 to-purple-600', 
    emoji: '🤖',
    descricao: 'Entre no mundo da robótica e programação, desenvolvendo projetos com sensores e comandos automatizados.'
  },
  { 
    id: 6, 
    nome: '6°, 7°, 8° e 9° Ano', 
    titulo: 'RoadRun Simetria',
    cor: 'from-red-500 to-pink-600', 
    emoji: '🏁',
    descricao: 'Participe de desafios de corrida com robôs, aplicando conceitos de física, matemática e programação competitiva.'
  },
  { 
    id: 7, 
    nome: 'Ensino Médio', 
    titulo: 'Hackathon',
    cor: 'from-purple-500 to-blue-600', 
    emoji: '💻',
    descricao: 'Desenvolva projetos inovadores em equipe durante uma maratona de programação, engenharia e produção audiovisual.',
    temGrupo: true
  },
]

function DesafioPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const desafio = desafios.find(d => d.id === parseInt(id))

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    oficina: desafio ? `${desafio.titulo} - ${desafio.nome}` : '',
    grupo: '',
  })
  const [termoAceito, setTermoAceito] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Redirecionar se o desafio não existir
  if (!desafio) {
    navigate('/desafios-turma')
    return null
  }

  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '')
    return cpfLimpo.length === 11
  }

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const formatarCPF = (valor) => {
    const cpfLimpo = valor.replace(/\D/g, '')
    return cpfLimpo
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'cpf') {
      setFormData({ ...formData, [name]: formatarCPF(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const isFormValid = () => {
    const baseValidation = (
      formData.nome.trim() !== '' &&
      validarCPF(formData.cpf) &&
      validarEmail(formData.email) &&
      formData.oficina !== '' &&
      termoAceito
    )
    
    // Se for Hackathon, validar grupo também
    if (desafio.temGrupo) {
      return baseValidation && formData.grupo !== ''
    }
    
    return baseValidation
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isFormValid()) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos corretamente e aceite o termo.' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      // Adicionar grupo ao nome da oficina se for Hackathon
      const oficinaNome = desafio.temGrupo 
        ? `${formData.oficina} - Grupo: ${formData.grupo}`
        : formData.oficina
      
      const dadosEnvio = {
        ...formData,
        oficina: oficinaNome
      }
      
      const response = await axios.post(`${API_URL}/api/inscricoes`, dadosEnvio)
      
      if (response.data.status === 'ok') {
        setMessage({ 
          type: 'success', 
          text: 'Inscrição concluída com sucesso!' 
        })
        
        // Resetar formulário
        setFormData({ 
          nome: '', 
          cpf: '', 
          email: '', 
          oficina: `${desafio.titulo} - ${desafio.nome}`,
          grupo: ''
        })
        setTermoAceito(false)
        
        // Redirecionar após 3 segundos para página de seleção de desafios
        setTimeout(() => {
          navigate('/desafios-turma')
        }, 3000)
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao enviar inscrição. Tente novamente.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/desafios-turma')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 ml-4 md:ml-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          {/* Ícone e Nome do Desafio */}
          <div className="inline-block mb-6">
            <div className={`w-24 h-24 bg-gradient-to-br ${desafio.cor} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <span className="text-5xl">{desafio.emoji}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {desafio.titulo}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{desafio.nome}</p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8 rounded-full"></div>
          
          {/* Descrição do Desafio */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {desafio.descricao}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Complete sua Inscrição
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados Pessoais */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Campo Desafio (somente leitura) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Desafio Selecionado *
                </label>
                <input
                  type="text"
                  name="oficina"
                  value={formData.oficina}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-50 rounded-xl focus:outline-none text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Campo Grupo (apenas para Hackathon) */}
              {desafio.temGrupo && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Selecione seu Grupo *
                  </label>
                  <select
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                    required
                  >
                    <option value="">Escolha um grupo</option>
                    <option value="Engenharia">Engenharia</option>
                    <option value="Robótica">Robótica</option>
                    <option value="Gravação/edição">Gravação/edição</option>
                  </select>
                </div>
              )}
            </div>

            {/* Termo de Responsabilidade */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="termo"
                  checked={termoAceito}
                  onChange={(e) => setTermoAceito(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="termo" className="text-sm text-gray-700 cursor-pointer">
                  Eu li e aceito os{' '}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    termos de responsabilidade
                  </button>
                  {' '}do evento. *
                </label>
              </div>
            </div>

            {/* Mensagem de Status */}
            {message.text && (
              <div className={`
                p-4 rounded-xl animate-fade-in
                ${message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                  : 'bg-red-100 text-red-800 border-2 border-red-300'}
              `}>
                {message.text}
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-white text-lg
                transition-all duration-300 transform
                ${isFormValid() && !loading
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar Inscrição'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Modal do Termo */}
      {showModal && <TermoModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default DesafioPage

