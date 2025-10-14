import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Configurar transporter do Nodemailer
const criarTransporter = () => {
  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Variáveis de e-mail não configuradas. E-mails não serão enviados.')
    return null
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

export async function enviarEmail({ destinatario, nome, oficina }) {
  const transporter = criarTransporter()

  if (!transporter) {
    console.log('📧 Simulação de e-mail (variáveis não configuradas):')
    console.log(`   Para: ${destinatario}`)
    console.log(`   Nome: ${nome}`)
    console.log(`   Oficina: ${oficina}`)
    return
  }

  const htmlEmail = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #2563eb;
          margin-top: 0;
        }
        .oficina-box {
          background: linear-gradient(135deg, #f0f9ff 0%, #f3e8ff 100%);
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .oficina-box strong {
          font-size: 18px;
          color: #1e40af;
        }
        .info-box {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .info-box p {
          margin: 10px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          background-color: #f9fafb;
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .emoji {
          font-size: 48px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="emoji">🎉</div>
          <h1>Open Doors Simetria 2025</h1>
          <p>Confirmação de Inscrição</p>
        </div>
        
        <div class="content">
          <h2>Olá, ${nome}! 👋</h2>
          
          <p>
            Estamos muito felizes em confirmar sua inscrição no <strong>Open Doors Simetria 2025</strong>!
            Sua participação foi registrada com sucesso.
          </p>
          
          <div class="oficina-box">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">OFICINA SELECIONADA</p>
            <strong>${oficina}</strong>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Próximos Passos</h3>
            <p>✅ Fique atento ao seu e-mail para mais informações</p>
            <p>✅ Prepare-se para uma experiência incrível de aprendizado</p>
            <p>✅ Traga sua criatividade e entusiasmo!</p>
          </div>
          
          <p>
            Se você tiver alguma dúvida, não hesite em entrar em contato conosco.
            Estamos ansiosos para vê-lo no evento!
          </p>
          
          <p style="margin-top: 30px;">
            <strong>Até breve!</strong><br>
            <span style="color: #6b7280;">Equipe Open Doors Simetria 2025</span>
          </p>
        </div>
        
        <div class="footer">
          <p>
            Este é um e-mail automático, por favor não responda.<br>
            © 2025 Open Doors Simetria - Todos os direitos reservados
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"Open Doors Simetria 2025" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: 'Confirmação de Inscrição – Open Doors Simetria 2025',
    html: htmlEmail,
    text: `
Olá, ${nome}!

Estamos muito felizes em confirmar sua inscrição no Open Doors Simetria 2025!

OFICINA SELECIONADA:
${oficina}

PRÓXIMOS PASSOS:
- Fique atento ao seu e-mail para mais informações
- Prepare-se para uma experiência incrível de aprendizado
- Traga sua criatividade e entusiasmo!

Se você tiver alguma dúvida, não hesite em entrar em contato conosco.
Estamos ansiosos para vê-lo no evento!

Até breve!
Equipe Open Doors Simetria 2025
    `.trim()
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ E-mail enviado com sucesso:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error.message)
    throw error
  }
}

