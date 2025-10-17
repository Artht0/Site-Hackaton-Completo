#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para processar logs reais de console e extrair dados de inscrições
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

// Função para extrair dados de inscrições dos logs
function extrairInscricoesDosLogs(logs) {
  const inscricoes = [];
  const linhas = logs.split('\n');
  
  let inscricaoAtual = null;
  let timestamp = null;
  
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    
    // Detecta início de nova requisição de inscrição
    if (linha.includes('📥 Nova requisição de inscrição recebida:')) {
      // Se já existe uma inscrição anterior, salva ela
      if (inscricaoAtual) {
        inscricoes.push(inscricaoAtual);
      }
      
      // Inicia nova inscrição
      inscricaoAtual = {
        timestamp: timestamp || new Date().toISOString(),
        nome: '',
        cpf: '',
        email: '',
        oficina: '',
        grupo: ''
      };
      
      // Procura pelos dados na próxima linha
      if (i + 1 < linhas.length) {
        const proximaLinha = linhas[i + 1];
        if (proximaLinha.includes('nome:')) {
          const match = proximaLinha.match(/nome:\s*['"]([^'"]+)['"]/);
          if (match) inscricaoAtual.nome = match[1];
        }
      }
    }
    
    // Extrai dados específicos
    if (inscricaoAtual) {
      if (linha.includes('nome:')) {
        const match = linha.match(/nome:\s*['"]([^'"]+)['"]/);
        if (match) inscricaoAtual.nome = match[1];
      }
      
      if (linha.includes('cpf:')) {
        const match = linha.match(/cpf:\s*['"]([^'"]+)['"]/);
        if (match) inscricaoAtual.cpf = match[1];
      }
      
      if (linha.includes('email:')) {
        const match = linha.match(/email:\s*['"]([^'"]+)['"]/);
        if (match) inscricaoAtual.email = match[1];
      }
      
      if (linha.includes('oficina:')) {
        const match = linha.match(/oficina:\s*['"]([^'"]+)['"]/);
        if (match) inscricaoAtual.oficina = match[1];
      }
      
      if (linha.includes('grupo:')) {
        const match = linha.match(/grupo:\s*['"]([^'"]*)['"]/);
        if (match) inscricaoAtual.grupo = match[1];
      }
    }
    
    // Detecta confirmação de salvamento
    if (linha.includes('✅ Inscrição salva com sucesso para:')) {
      const match = linha.match(/✅ Inscrição salva com sucesso para:\s*(.+)/);
      if (match && inscricaoAtual) {
        inscricaoAtual.email = match[1].trim();
        inscricoes.push(inscricaoAtual);
        inscricaoAtual = null;
      }
    }
  }
  
  // Adiciona a última inscrição se existir
  if (inscricaoAtual) {
    inscricoes.push(inscricaoAtual);
  }
  
  return inscricoes;
}

// Função para processar dados de inscrições
function processarInscricoes(dados) {
  return dados.map((inscricao, index) => ({
    id: index + 1,
    timestamp: inscricao.timestamp,
    nome: inscricao.nome,
    cpf_mascarado: mascararCPF(inscricao.cpf),
    email_mascarado: mascararEmail(inscricao.email),
    oficina: inscricao.oficina,
    grupo: inscricao.grupo || ''
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
  console.log('🔄 Processando logs reais de inscrições...');
  console.log('⚠️  REMOVENDO dados sensíveis (CPF e email mascarados)');
  
  try {
    // Logs fornecidos pelo usuário
    const logsReais = `==> Running 'npm start'
> open-doors-backend@1.0.0 start
> node server.js
🚀 Servidor rodando na porta 5000
✅ Sistema funcionando - inscrições salvas em: data/inscricoes.json
📥 Nova requisição de inscrição recebida: {
  nome: 'Fernanda Sardinha de Abreu tacon',
  cpf: '891.606.491-00',
  email: 'fernandabreu2010@yahoo.com.br',
  oficina: 'Redação'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '128',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '200.18.165.18',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900c03d48f4f181-GRU',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '8e219894-000c-463d',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '200.18.165.18',
  'x-forwarded-for': '200.18.165.18, 172.69.138.162, 10.207.229.196',
  'x-request-start': '1760714122169018'
}
✅ Inscrição salva com sucesso para: fernandabreu2010@yahoo.com.br
📥 Nova requisição de inscrição recebida: {
  nome: 'Fernanda Sardinha de Abreu tacon',
  cpf: '891.606.491-00',
  email: 'fernandabreu2010@yahoo.com.br',
  oficina: 'Iluminando uma cidade - 4° Ano',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '161',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '200.18.165.18',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900c1b66b8ff1ab-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '5bc1afd4-2e65-4dbf',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '200.18.165.18',
  'x-forwarded-for': '200.18.165.18, 104.23.197.237, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760714182234152'
}
✅ Inscrição salva com sucesso para: fernandabreu2010@yahoo.com.br
📥 Nova requisição de inscrição recebida: {
  nome: 'Lucas Zacharias Vale Garcia',
  cpf: '881.617.811-68',
  email: 'kzvale@hotmail.com',
  oficina: 'Realidade Virtual'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  'content-length': '121',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.202.53.30',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900d0fbab0d5c55-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '2973456a-c1fe-4e33',
  'sec-ch-ua': '"Not?A_Brand";v="99", "Samsung Internet";v="28.0", "Chromium";v="130"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.202.53.30',
  'x-forwarded-for': '177.202.53.30, 104.23.197.190, 10.207.229.196',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760714807709261'
}
✅ Inscrição salva com sucesso para: kzvale@hotmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Marcio henrique pereira garcia',
  cpf: '924.709.881-15',
  email: 'mar100rick@gmail.com',
  oficina: 'Realidade Virtual'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  'content-length': '126',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.202.53.30',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900d2d4ddc85c55-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'e51037d9-799a-4bb3',
  'sec-ch-ua': '"Not?A_Brand";v="99", "Samsung Internet";v="28.0", "Chromium";v="130"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.202.53.30',
  'x-forwarded-for': '177.202.53.30, 104.23.197.208, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760714883426371'
}
✅ Inscrição salva com sucesso para: mar100rick@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Lucas Zacharias Vale Garcia',
  cpf: '881.617.811-68',
  email: 'kzvale@hotmail.com',
  oficina: 'Realidade Virtual'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  'content-length': '121',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.202.53.30',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900d3439a865c55-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'a6fd4e87-892d-462c',
  'sec-ch-ua': '"Not?A_Brand";v="99", "Samsung Internet";v="28.0", "Chromium";v="130"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.202.53.30',
  'x-forwarded-for': '177.202.53.30, 104.23.197.204, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760714901150706'
}
📥 Nova requisição de inscrição recebida: {
  nome: 'Lucas Zacharias Vale Garcia',
  cpf: '086.286.521-24',
  email: 'kzvale@hotmail.com',
  oficina: 'Realidade Virtual'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  'content-length': '121',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.202.53.30',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900d50f9f505c55-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '4ad023fa-8b47-49be',
  'sec-ch-ua': '"Not?A_Brand";v="99", "Samsung Internet";v="28.0", "Chromium";v="130"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.202.53.30',
  'x-forwarded-for': '177.202.53.30, 104.23.197.81, 10.207.229.196',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760714974744290'
}
📥 Nova requisição de inscrição recebida: {
  nome: 'Karina Zacharias Vale Garcia',
  cpf: '881.617.811-68',
  email: 'kzvale@hotmail.com',
  oficina: 'Realidade Virtual'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  'content-length': '122',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.202.53.30',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900d6dd5b295c58-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '527b647b-7558-4f3a',
  'sec-ch-ua': '"Not?A_Brand";v="99", "Samsung Internet";v="28.0", "Chromium";v="130"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.202.53.30',
  'x-forwarded-for': '177.202.53.30, 104.23.197.202, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760715048641067'
}
📥 Nova requisição de inscrição recebida: {
  nome: 'Léa Fortunato Chaves',
  cpf: '989.939.091-72',
  email: 'leafortunatto@gmail.com',
  oficina: 'Artes'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '108',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '179.251.167.52',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900d883ab0cf19f-GRU',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '6d271899-5357-460c',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '179.251.167.52',
  'x-forwarded-for': '179.251.167.52, 172.69.138.162, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760715116462597'
}
✅ Inscrição salva com sucesso para: leafortunatto@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Léa Fortunato',
  cpf: '989.939.091-72',
  email: 'leafortunatto@gmail.com',
  oficina: 'Deu praia! - Educação Infantil',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '139',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '179.251.167.52',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900de218a4c582d-GIG',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'bcf9731c-fe7d-4b89',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '179.251.167.52',
  'x-forwarded-for': '179.251.167.52, 172.69.90.4, 10.207.74.66',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760715346483266'
}
✅ Inscrição salva com sucesso para: leafortunatto@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'VANESSA EMANUELLE CARVALHO MELO RIGONATO',
  cpf: '910.826.331-00',
  email: 've.rigonato@gmail.com',
  oficina: 'Robótica e programação - 5° Ano',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '165',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '186.213.217.137',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900f89488f48300-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '669b4db8-04a9-46bc',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '186.213.217.137',
  'x-forwarded-for': '186.213.217.137, 104.23.197.203, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760716429598154'
}
✅ Inscrição salva com sucesso para: ve.rigonato@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'FAINY christhiny Paiva dias calixto',
  cpf: '025.808.471-54',
  email: 'fainycris@hotmail.com',
  oficina: 'Química'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.69 Mobile/15E148 Safari/604.1',
  'content-length': '122',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.35.103',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900fd71fd9ca4d7-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '2a5f420f-6602-46a3',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.35.103',
  'x-forwarded-for': '177.200.35.103, 104.23.197.124, 10.207.74.66',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760716628895973'
}
✅ Inscrição salva com sucesso para: fainycris@hotmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'FAINY christhiny Paiva dias calixto',
  cpf: '025.808.471-54',
  email: 'fainycris@hotmail.com',
  oficina: 'Realidade Virtual'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.69 Mobile/15E148 Safari/604.1',
  'content-length': '131',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.35.103',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900fe13ead0a4d7-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '6c711321-4a3d-4b0a',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.35.103',
  'x-forwarded-for': '177.200.35.103, 104.23.197.86, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760716654794100'
}
✅ Inscrição salva com sucesso para: fainycris@hotmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'FAINY christhiny Paiva dias calixto',
  cpf: '025.808.471-54',
  email: 'fainycris@hotmail.com',
  oficina: 'Artes'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.69 Mobile/15E148 Safari/604.1',
  'content-length': '119',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.35.103',
  'cf-ipcountry': 'BR',
  'cf-ray': '9900ffdd8b582550-GRU',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=3, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '2e967247-7d7b-4fdb',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.35.103',
  'x-forwarded-for': '177.200.35.103, 172.71.234.193, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760716728283798'
}
✅ Inscrição salva com sucesso para: fainycris@hotmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'FAINY christhiny Paiva dias calixto',
  cpf: '025.808.472-54',
  email: 'fainycris@hotmail.com',
  oficina: 'Deu praia! - Educação Infantil',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.69 Mobile/15E148 Safari/604.1',
  'content-length': '157',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.35.103',
  'cf-ipcountry': 'BR',
  'cf-ray': '990100ab99b12550-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=3, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '2a0f30c7-1328-4802',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.35.103',
  'x-forwarded-for': '177.200.35.103, 104.23.197.198, 10.207.74.66',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760716760989156'
}
✅ Inscrição salva com sucesso para: fainycris@hotmail.com
> open-doors-backend@1.0.0 start
> node server.js
🚀 Servidor rodando na porta 5000
✅ Sistema funcionando - inscrições salvas em: data/inscricoes.json
📥 Nova requisição de inscrição recebida: {
  nome: 'ARIANA RITVA SANTOS LOOKS DE SIQUEIRA',
  cpf: '012.460.411-03',
  email: 'arianalooks@gmail.com',
  oficina: 'Química'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  'content-length': '124',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '200.175.172.92',
  'cf-ipcountry': 'BR',
  'cf-ray': '990117f72f658303-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '3d486048-2994-4701',
  'sec-ch-ua': '"Not?A_Brand";v="99", "Samsung Internet";v="28.0", "Chromium";v="130"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '200.175.172.92',
  'x-forwarded-for': '200.175.172.92, 104.23.197.161, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760717715139862'
}
✅ Inscrição salva com sucesso para: arianalooks@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Fabio Araújo de Siqueira',
  cpf: '002.425.971-30',
  email: 'arianalooks@gmail.com',
  oficina: 'IA/Programação'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  'content-length': '121',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '200.175.172.92',
  'cf-ipcountry': 'BR',
  'cf-ray': '99011b249d7b8309-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'aadfa451-1944-4a63',
  'sec-ch-ua': '"Not?A_Brand";v="99", "Samsung Internet";v="28.0", "Chromium";v="130"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '200.175.172.92',
  'x-forwarded-for': '200.175.172.92, 104.23.197.202, 10.207.74.66',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760717845305736'
}
✅ Inscrição salva com sucesso para: arianalooks@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Maria Maia de Bem',
  cpf: '088.826.521-22',
  email: 'amandamayraa@gmail.com',
  oficina: 'Folclore com argila - 1° e 2° Anos',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '144',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.34.28',
  'cf-ipcountry': 'BR',
  'cf-ray': '990124739c8e02ea-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'b1f3a8bb-796e-484a',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.34.28',
  'x-forwarded-for': '177.200.34.28, 104.23.197.70, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760718226590407'
}
✅ Inscrição salva com sucesso para: amandamayraa@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Maria Maia de Bem',
  cpf: '088.826.521-22',
  email: 'amandamayraa@gmail.com',
  oficina: 'Artes'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '102',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.34.28',
  'cf-ipcountry': 'BR',
  'cf-ray': '990127624bd2f02f-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '5e56556e-c36b-43fd',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.34.28',
  'x-forwarded-for': '177.200.34.28, 104.23.197.15, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760718346692179'
}
✅ Inscrição salva com sucesso para: amandamayraa@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Amanda Mayra Maia de Freitas',
  cpf: '035.914.891-31',
  email: 'amandamayraa@gmail.com',
  oficina: 'Artes'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '113',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.34.28',
  'cf-ipcountry': 'BR',
  'cf-ray': '99012adcaac6c76a-GRU',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'ecfb46b2-b39a-4e1d',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.34.28',
  'x-forwarded-for': '177.200.34.28, 104.23.254.181, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760718489430288'
}
📥 Nova requisição de inscrição recebida: {
  nome: 'Lucas Pozzobon de Bem',
  cpf: '724.685.391-44',
  email: 'debem.office@gmail.com',
  oficina: 'Artes'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '106',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.34.28',
  'cf-ipcountry': 'BR',
  'cf-ray': '99012c8d2ae2768e-GRU',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '804f54a4-9113-4692',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.34.28',
  'x-forwarded-for': '177.200.34.28, 104.23.254.180, 10.207.74.66',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760718558632448'
}
✅ Inscrição salva com sucesso para: debem.office@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Lucas',
  cpf: '724.685.301-44',
  email: 'debem.office@gmail.com',
  oficina: 'IA/Programação'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'content-length': '101',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '177.200.34.28',
  'cf-ipcountry': 'BR',
  'cf-ray': '99012d5359f05625-GRU',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=1, i',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '26342d59-051b-4eed',
  'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'true-client-ip': '177.200.34.28',
  'x-forwarded-for': '177.200.34.28, 172.68.18.92, 10.207.229.196',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760718590354727'
}
✅ Inscrição salva com sucesso para: debem.office@gmail.com
==> Running 'npm start'
> open-doors-backend@1.0.0 start
> node server.js
🚀 Servidor rodando na porta 5000
✅ Sistema funcionando - inscrições salvas em: data/inscricoes.json
📥 Nova requisição de inscrição recebida: {
  nome: 'Thiago Francisco de Meneses',
  cpf: '976.873.831-68',
  email: 'thiggo@gmail.com',
  oficina: 'Construindo uma cidade - 3° Ano',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'content-length': '144',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '45.230.192.161',
  'cf-ipcountry': 'BR',
  'cf-ray': '990145570b810aff-BSB',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=0',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '4fd25432-b282-42b5',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-gpc': '1',
  'true-client-ip': '45.230.192.161',
  'x-forwarded-for': '45.230.192.161, 172.69.213.148, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760719574015385'
}
✅ Inscrição salva com sucesso para: thiggo@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Thiago Francisco de Meneses',
  cpf: '976.873.831-68',
  email: 'thiggo@gmail.com',
  oficina: 'Robótica e programação - 5° Ano',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'content-length': '147',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '45.230.192.161',
  'cf-ipcountry': 'BR',
  'cf-ray': '990148093e060aff-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=0',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '614ba2ad-ee71-4436',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-gpc': '1',
  'true-client-ip': '45.230.192.161',
  'x-forwarded-for': '45.230.192.161, 104.23.197.231, 10.207.229.196',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760719684125177'
}
✅ Inscrição salva com sucesso para: thiggo@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Kamilla Soares Garcia',
  cpf: '003.333.671-70',
  email: 'millasgarcia@gmail.com',
  oficina: 'Construindo uma cidade - 3° Ano',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'content-length': '144',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '45.230.192.161',
  'cf-ipcountry': 'BR',
  'cf-ray': '99014c27ae360aff-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=0',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'd8673709-aac0-4374',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-gpc': '1',
  'true-client-ip': '45.230.192.161',
  'x-forwarded-for': '45.230.192.161, 104.23.197.61, 10.207.74.66',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760719852829422'
}
✅ Inscrição salva com sucesso para: millasgarcia@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Kamilla Soares Garcia',
  cpf: '003.333.671-70',
  email: 'millasgarcia@gmail.com',
  oficina: 'Robótica e programação - 5° Ano',
  grupo: ''
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'content-length': '147',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '45.230.192.161',
  'cf-ipcountry': 'BR',
  'cf-ray': '99014f5f1da00aff-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=0',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '7444ed84-1319-4dbe',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-gpc': '1',
  'true-client-ip': '45.230.192.161',
  'x-forwarded-for': '45.230.192.161, 104.23.197.173, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760719984585463'
}
✅ Inscrição salva com sucesso para: millasgarcia@gmail.com
==> Running 'npm start'
> open-doors-backend@1.0.0 start
> node server.js
🚀 Servidor rodando na porta 5000
✅ Sistema funcionando - inscrições salvas em: data/inscricoes.json
📥 Nova requisição de inscrição recebida: {
  nome: 'Thiago Francisco de Meneses',
  cpf: '976.873.831-68',
  email: 'thiggo@gmail.com',
  oficina: 'IA/Programação'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'content-length': '117',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '45.230.192.161',
  'cf-ipcountry': 'BR',
  'cf-ray': '99018d0e8b8d0b01-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=0',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'cc7375d4-86ad-49ac',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-gpc': '1',
  'true-client-ip': '45.230.192.161',
  'x-forwarded-for': '45.230.192.161, 104.23.197.47, 10.207.74.66',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760722511215282'
}
✅ Inscrição salva com sucesso para: thiggo@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Kamilla Soares Garcia',
  cpf: '003.333.671-70',
  email: 'millasgarcia@gmail.com',
  oficina: 'IA/Programação'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'content-length': '117',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '45.230.192.161',
  'cf-ipcountry': 'BR',
  'cf-ray': '99019dec3a330af6-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=0',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': '62145758-b442-4724',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-gpc': '1',
  'true-client-ip': '45.230.192.161',
  'x-forwarded-for': '45.230.192.161, 104.23.197.225, 10.207.74.66',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760723202042005'
}
✅ Inscrição salva com sucesso para: millasgarcia@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Thiago Francisco de Meneses',
  cpf: '976.873.831-68',
  email: 'thiggo@gmail.com',
  oficina: 'Artes'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'content-length': '106',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '45.230.192.161',
  'cf-ipcountry': 'BR',
  'cf-ray': '99019e952f780af6-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=0',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'f932657b-9e2a-47cc',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-gpc': '1',
  'true-client-ip': '45.230.192.161',
  'x-forwarded-for': '45.230.192.161, 104.23.197.205, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760723229071904'
}
✅ Inscrição salva com sucesso para: thiggo@gmail.com
📥 Nova requisição de inscrição recebida: {
  nome: 'Kamilla Soares Garcia',
  cpf: '003.333.671-70',
  email: 'millasgarcia@gmail.com',
  oficina: 'Artes'
}
🌐 Origin: https://confirmacaoopendoors.vercel.app
🔗 Headers: {
  host: 'site-open-doors.onrender.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'content-length': '106',
  accept: 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, br',
  'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
  'cdn-loop': 'cloudflare; loops=1',
  'cf-connecting-ip': '45.230.192.161',
  'cf-ipcountry': 'BR',
  'cf-ray': '99019f4a9d950af6-CMH',
  'cf-visitor': '{"scheme":"https"}',
  'content-type': 'application/json',
  dnt: '1',
  origin: 'https://confirmacaoopendoors.vercel.app',
  priority: 'u=0',
  referer: 'https://confirmacaoopendoors.vercel.app/',
  'render-proxy-ttl': '4',
  'rndr-id': 'ec95d454-5883-4aec',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-gpc': '1',
  'true-client-ip': '45.230.192.161',
  'x-forwarded-for': '45.230.192.161, 104.23.197.209, 10.207.175.131',
  'x-forwarded-proto': 'https',
  'x-request-start': '1760723258098881'
}
✅ Inscrição salva com sucesso para: millasgarcia@gmail.com`;

    // Extrai dados dos logs
    const inscricoes = extrairInscricoesDosLogs(logsReais);
    
    console.log(`📊 Total de inscrições encontradas: ${inscricoes.length}`);
    
    // Processa os dados
    const dadosProcessados = processarInscricoes(inscricoes);
    const csv = converterParaCSV(dadosProcessados);
    
    // Salva o arquivo CSV
    const arquivoSaida = path.join(__dirname, 'inscricoes_logs_reais.csv');
    fs.writeFileSync(arquivoSaida, csv, 'utf8');
    
    console.log('✅ CSV gerado com sucesso!');
    console.log('📁 Arquivo salvo em:', arquivoSaida);
    console.log('🔒 Dados sensíveis foram mascarados:');
    console.log('   - CPF: Primeiros 3 e últimos 2 dígitos visíveis');
    console.log('   - Email: Apenas 2 primeiros caracteres do usuário');
    
    // Mostra preview dos dados
    console.log('\n📊 Preview dos dados processados:');
    console.log(csv);
    
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
  extrairInscricoesDosLogs,
  processarInscricoes,
  converterParaCSV
};