import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Open Doors Simetria 2025
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8 rounded-full"></div>
          </div>

          {/* Description */}
          <div className="space-y-6 mb-10 text-gray-700">
            <p className="text-lg md:text-xl leading-relaxed text-center">
              Bem-vindo ao maior evento de inovação e tecnologia do ano! 
              O Open Doors Simetria 2025 é uma oportunidade única para estudantes 
              explorarem suas habilidades criativas, aprenderem novas tecnologias 
              e colaborarem em projetos incríveis.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-bold text-lg mb-2 text-blue-900">Inovação</h3>
                <p className="text-sm text-blue-800">Desenvolva soluções criativas para problemas reais</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="font-bold text-lg mb-2 text-purple-900">Aprendizado</h3>
                <p className="text-sm text-purple-800">Participe de oficinas práticas e interativas</p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-bold text-lg mb-2 text-pink-900">Colaboração</h3>
                <p className="text-sm text-pink-800">Trabalhe em equipe e faça novas amizades</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/inscricao')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Oficinas
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => navigate('/desafios-turma')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Desafios de Turma
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              Vagas limitadas! Garanta sua participação.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 