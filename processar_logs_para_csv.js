#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para processar logs/dados de inscrições e converter para CSV
 * REMOVENDO dados sensíveis como CPF
 */

// Função para mascarar CPF (substitui por ***)
function mascararCPF(cpf) {
  if (!cpf) return '';
  // Remove formatação e mantém apenas os primeiros 3 e últimos 2 dígitos
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length === 11) {
    return cpfLimpo.substring(0, 3) + '.***.**' + cpfLimpo.substring(9);
  }
  return '***.***.***';
}

// Função para mascarar email (mantém apenas o domínio)
function mascararEmail(email) {
  if (!email) return '';
  const [usuario, dominio] = email.split('@');
  if (usuario && dominio) {
    return usuario.substring(0, 2) + '***@' + dominio;
  }
  return '***@***';
}

// Função para processar dados de inscrições
function processarInscricoes(dados) {
  return dados.map(inscricao => ({
    id: inscricao.id,
    nome: inscricao.nome,
    cpf_mascarado: mascararCPF(inscricao.cpf),
    email_mascarado: mascararEmail(inscricao.email),
    oficina: inscricao.oficina,
    dataInscricao: inscricao.dataInscricao
  }));
}

// Função para converter para CSV
function converterParaCSV(dados) {
  if (dados.length === 0) return '';
  
  // Cabeçalhos
  const cabecalhos = Object.keys(dados[0]);
  const csvCabecalhos = cabecalhos.join(',');
  
  // Dados
  const linhas = dados.map(linha => {
    return cabecalhos.map(cabecalho => {
      const valor = linha[cabecalho] || '';
      // Escapa aspas duplas e envolve em aspas se contém vírgula
      const valorEscapado = String(valor).replace(/"/g, '""');
      return valorEscapado.includes(',') ? `"${valorEscapado}"` : valorEscapado;
    }).join(',');
  });
  
  return [csvCabecalhos, ...linhas].join('\n');
}

// Função principal
function main() {
  console.log('🔄 Processando dados de inscrições para CSV...');
  console.log('⚠️  REMOVENDO dados sensíveis (CPF e email mascarados)');
  
  try {
    // Caminhos dos arquivos
    const arquivoEntrada = path.join(__dirname, 'backend', 'data', 'inscricoes.example.json');
    const arquivoSaida = path.join(__dirname, 'inscricoes_processadas.csv');
    
    // Verifica se o arquivo de entrada existe
    if (!fs.existsSync(arquivoEntrada)) {
      console.log('❌ Arquivo de inscrições não encontrado:', arquivoEntrada);
      console.log('📝 Usando dados de exemplo...');
      
      // Dados de exemplo baseados no arquivo example
      const dadosExemplo = [
        {
          "id": 1697123456789,
          "nome": "Maria Silva Santos",
          "cpf": "123.456.789-00",
          "email": "maria.silva@email.com",
          "oficina": "Oficina 1 – Robótica Criativa",
          "dataInscricao": "2025-10-14T10:30:00.000Z"
        },
        {
          "id": 1697123456790,
          "nome": "João Pedro Oliveira",
          "cpf": "987.654.321-00",
          "email": "joao.pedro@email.com",
          "oficina": "Oficina 3 – Programação Web",
          "dataInscricao": "2025-10-14T11:15:00.000Z"
        },
        {
          "id": 1697123456791,
          "nome": "Ana Carolina Costa",
          "cpf": "456.789.123-00",
          "email": "ana.costa@email.com",
          "oficina": "Oficina 2 – Design Thinking",
          "dataInscricao": "2025-10-14T14:20:00.000Z"
        }
      ];
      
      // Processa os dados
      const dadosProcessados = processarInscricoes(dadosExemplo);
      const csv = converterParaCSV(dadosProcessados);
      
      // Salva o arquivo CSV
      fs.writeFileSync(arquivoSaida, csv, 'utf8');
      
      console.log('✅ CSV gerado com sucesso!');
      console.log('📁 Arquivo salvo em:', arquivoSaida);
      console.log('🔒 Dados sensíveis foram mascarados:');
      console.log('   - CPF: Primeiros 3 e últimos 2 dígitos visíveis');
      console.log('   - Email: Apenas 2 primeiros caracteres do usuário');
      
      // Mostra preview dos dados
      console.log('\n📊 Preview dos dados processados:');
      console.log(csv);
      
    } else {
      // Lê o arquivo real
      const dados = JSON.parse(fs.readFileSync(arquivoEntrada, 'utf8'));
      
      // Processa os dados
      const dadosProcessados = processarInscricoes(dados);
      const csv = converterParaCSV(dadosProcessados);
      
      // Salva o arquivo CSV
      fs.writeFileSync(arquivoSaida, csv, 'utf8');
      
      console.log('✅ CSV gerado com sucesso!');
      console.log('📁 Arquivo salvo em:', arquivoSaida);
      console.log('📊 Total de registros processados:', dadosProcessados.length);
      console.log('🔒 Dados sensíveis foram mascarados');
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar dados:', error.message);
    process.exit(1);
  }
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = {
  mascararCPF,
  mascararEmail,
  processarInscricoes,
  converterParaCSV
};