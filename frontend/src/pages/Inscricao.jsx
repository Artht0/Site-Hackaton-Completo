import { useNavigate } from 'react-router-dom'

const oficinas = [
  { id: 1, nome: 'Oficina 1 – Robótica Criativa', cor: 'from-blue-500 to-blue-600', emoji: '🤖' },
  { id: 2, nome: 'Oficina 2 – Design Thinking', cor: 'from-green-500 to-green-600', emoji: '🎨' },
  { id: 3, nome: 'Oficina 3 – Programação Web', cor: 'from-yellow-500 to-yellow-600', emoji: '💻' },
  { id: 4, nome: 'Oficina 4 – Inteligência Artificial', cor: 'from-red-500 to-red-600', emoji: '🧠' },
  { id: 5, nome: 'Oficina 5 – Desenvolvimento Mobile', cor: 'from-orange-500 to-orange-600', emoji: '📱' },
  { id: 6, nome: 'Oficina 6 – Segurança Digital', cor: 'from-purple-500 to-purple-600', emoji: '🔒' },
]

function Inscricao() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
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
            Escolha sua Oficina
          </h1>
          <p className="text-gray-600">Selecione a oficina que deseja participar</p>
        </div>

        {/* Grade de Oficinas */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-slide-up">
          <div className="grid grid-cols-2 gap-4">
            {oficinas.map((oficina) => (
              <button
                key={oficina.id}
                onClick={() => navigate(`/oficina/${oficina.id}`)}
                className={`
                  relative p-6 rounded-2xl font-semibold text-white
                  bg-gradient-to-br ${oficina.cor}
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-xl
                  hover:ring-2 hover:ring-offset-2 hover:ring-gray-400
                `}
              >
                <div className="text-4xl mb-3">{oficina.emoji}</div>
                <div className="text-sm md:text-base leading-tight">
                  {oficina.nome}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inscricao

