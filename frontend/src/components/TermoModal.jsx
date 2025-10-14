function TermoModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Termo de Responsabilidade</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div className="space-y-4 text-gray-700">
            <p className="font-semibold text-lg text-gray-900">
              Hackathon Escolar 2025 - Termos e Condições
            </p>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">1. Aceitação dos Termos</h3>
              <p className="text-sm leading-relaxed">
                Ao se inscrever no Hackathon Escolar 2025, você concorda em cumprir e estar vinculado 
                a estes termos e condições. Se você não concordar com qualquer parte destes termos, 
                não deverá participar do evento.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">2. Elegibilidade</h3>
              <p className="text-sm leading-relaxed">
                O evento é aberto a estudantes regularmente matriculados em instituições de ensino. 
                Participantes menores de 18 anos devem ter autorização expressa dos pais ou responsáveis legais.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">3. Comportamento e Conduta</h3>
              <p className="text-sm leading-relaxed">
                Os participantes devem manter comportamento respeitoso e profissional durante todo o evento. 
                Comportamento inadequado, assédio ou desrespeito a outros participantes, organizadores ou 
                patrocinadores resultará em desqualificação imediata.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">4. Responsabilidade</h3>
              <p className="text-sm leading-relaxed">
                Os organizadores não se responsabilizam por objetos pessoais perdidos, roubados ou 
                danificados durante o evento. Cada participante é responsável por seus pertences.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">5. Propriedade Intelectual</h3>
              <p className="text-sm leading-relaxed">
                Os participantes mantêm todos os direitos sobre suas criações durante o evento. 
                No entanto, ao participar, você concede aos organizadores o direito de usar, 
                reproduzir e exibir seu projeto para fins promocionais do evento.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">6. Uso de Imagem</h3>
              <p className="text-sm leading-relaxed">
                Ao participar do evento, você autoriza a captação e uso de sua imagem em fotografias 
                e vídeos para divulgação do Hackathon Escolar em materiais promocionais, redes sociais 
                e website oficial.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">7. Saúde e Segurança</h3>
              <p className="text-sm leading-relaxed">
                Os participantes declaram estar em boas condições de saúde para participar do evento. 
                Qualquer condição médica relevante deve ser comunicada aos organizadores no momento da inscrição.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">8. Cancelamento</h3>
              <p className="text-sm leading-relaxed">
                Os organizadores reservam-se o direito de cancelar ou modificar o evento devido a 
                circunstâncias imprevistas. Em caso de cancelamento, os participantes serão notificados 
                com antecedência através do e-mail fornecido na inscrição.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">9. Privacidade de Dados</h3>
              <p className="text-sm leading-relaxed">
                As informações fornecidas na inscrição serão utilizadas exclusivamente para fins de 
                organização e comunicação relacionadas ao evento, em conformidade com a Lei Geral de 
                Proteção de Dados (LGPD).
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">10. Aceitação</h3>
              <p className="text-sm leading-relaxed">
                Ao marcar a caixa de aceitação, você declara ter lido, compreendido e concordado com 
                todos os termos e condições aqui estabelecidos.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermoModal

