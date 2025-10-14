import { useNavigate } from 'react-router-dom'

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

function DesafiosTurma() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Desafios de Turma
          </h1>
          <p className="text-gray-600">Selecione o desafio da sua turma</p>
        </div>

        {/* Grade de Desafios */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {desafios.map((desafio) => (
              <button
                key={desafio.id}
                onClick={() => navigate(`/desafio/${desafio.id}`)}
                className={`
                  relative p-6 rounded-2xl text-white text-left
                  bg-gradient-to-br ${desafio.cor}
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-xl
                  hover:ring-2 hover:ring-offset-2 hover:ring-gray-400
                  flex flex-col items-start
                `}
              >
                <div className="text-5xl mb-3">{desafio.emoji}</div>
                <div className="text-xs font-semibold mb-1 opacity-90">
                  {desafio.nome}
                </div>
                <div className="text-lg font-bold mb-2">
                  {desafio.titulo}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesafiosTurma

