// Dados históricos de projetos Pipefy
const dadosHistoricos = [
    {
        id: 'PJT001',
        casoUso: 'Onboarding de Clientes',
        tamanhoCliente: 'Médio',
        area: 'Vendas',
        numPipes: 3,
        integracoes: 'Sim - Média',
        migracaoDados: 'Não',
        complexidade: 'Média',
        horasReais: 120
    },
    {
        id: 'PJT002',
        casoUso: 'Aprovação de Compras',
        tamanhoCliente: 'Grande',
        area: 'Finanças',
        numPipes: 2,
        integracoes: 'Sim - Baixa',
        migracaoDados: 'Sim - Baixa',
        complexidade: 'Média',
        horasReais: 90
    },
    {
        id: 'PJT003',
        casoUso: 'Gestão de Recrutamento',
        tamanhoCliente: 'Pequeno',
        area: 'RH',
        numPipes: 1,
        integracoes: 'Não',
        migracaoDados: 'Não',
        complexidade: 'Baixa',
        horasReais: 45
    },
    {
        id: 'PJT004',
        casoUso: 'IT Service Desk',
        tamanhoCliente: 'Enterprise',
        area: 'TI',
        numPipes: 5,
        integracoes: 'Sim - Alta',
        migracaoDados: 'Sim - Média',
        complexidade: 'Alta',
        horasReais: 250
    }
];

// Processos típicos de RH
const processosRH = [
    {
        nome: 'Recrutamento e Seleção',
        descricao: 'Gestão completa do processo de contratação',
        fases: ['Abertura da Vaga', 'Triagem', 'Entrevistas', 'Aprovação', 'Contratação']
    },
    {
        nome: 'Onboarding de Funcionários',
        descricao: 'Integração de novos colaboradores',
        fases: ['Documentação', 'Treinamentos', 'Equipamentos', 'Integração', 'Avaliação']
    },
    {
        nome: 'Avaliação de Desempenho',
        descricao: 'Processo de avaliação periódica dos colaboradores',
        fases: ['Planejamento', 'Auto-avaliação', 'Avaliação Gestor', 'Feedback', 'Plano de Desenvolvimento']
    }
];

let currentStep = 1;
let dadosProjeto = {};
let processosConfigurados = [];

// Navegação entre steps
function nextStep(step) {
    if (validateCurrentStep()) {
        document.getElementById(`step${currentStep}`).classList.add('hidden');
        document.getElementById(`step${step}`).classList.remove('hidden');
        document.getElementById(`step${step}`).classList.add('animate-fade-in');
        
        updateProgressBar(step);
        currentStep = step;
        
        if (step === 2) {
            loadProcessos();
        } else if (step === 3) {
            gerarEstimativa();
        }
    }
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${step}`).classList.remove('hidden');
    document.getElementById(`step${step}`).classList.add('animate-fade-in');
    
    updateProgressBar(step);
    currentStep = step;
}

function updateProgressBar(step) {
    for (let i = 1; i <= 3; i++) {
        const indicator = document.getElementById(`step${i}-indicator`);
        if (i <= step) {
            indicator.className = 'w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold';
        } else {
            indicator.className = 'w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold';
        }
    }
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const required = ['clienteNome', 'tamanhoCliente', 'objetivoPrincipal', 'maturidadeDigital', 'numeroUsuarios', 'expectativaPrazo'];
        for (let field of required) {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                element.focus();
                element.classList.add('border-red-500');
                setTimeout(() => element.classList.remove('border-red-500'), 3000);
                return false;
            }
        }
        
        // Salvar dados do step 1
        dadosProjeto = {
            clienteNome: document.getElementById('clienteNome').value,
            tamanhoCliente: document.getElementById('tamanhoCliente').value,
            objetivoPrincipal: document.getElementById('objetivoPrincipal').value,
            maturidadeDigital: document.getElementById('maturidadeDigital').value,
            numeroUsuarios: parseInt(document.getElementById('numeroUsuarios').value),
            expectativaPrazo: document.getElementById('expectativaPrazo').value
        };
    }
    return true;
}

function loadProcessos() {
    const container = document.getElementById('processos-container');
    container.innerHTML = '';
    
    processosRH.forEach((processo, index) => {
        const processoCard = createProcessoCard(processo, index);
        container.appendChild(processoCard);
    });
}

function createProcessoCard(processo, index) {
    const card = document.createElement('div');
    card.className = 'border border-gray-200 rounded-lg p-6 mb-6';
    card.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">${index + 1}. ${processo.nome}</h3>
            <span class="text-sm text-gray-500">${processo.fases.length} fases</span>
        </div>
        
        <p class="text-gray-600 mb-4">${processo.descricao}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Complexidade dos Campos</label>
                <select id="complexidadeCampos${index}" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="Simples">Simples</option>
                    <option value="Médios" selected>Médios</option>
                    <option value="Complexos">Complexos</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Automações</label>
                <select id="automacoes${index}" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="Baixa">Baixa</option>
                    <option value="Média" selected>Média</option>
                    <option value="Alta">Alta</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Integrações</label>
                <select id="integracoes${index}" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="Não">Não</option>
                    <option value="Sim - Baixa">Sim - Baixa</option>
                    <option value="Sim - Média" selected>Sim - Média</option>
                    <option value="Sim - Alta">Sim - Alta</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bases de Dados</label>
                <select id="basesDados${index}" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="Não">Não</option>
                    <option value="Sim - Simples" selected>Sim - Simples</option>
                    <option value="Sim - Complexas">Sim - Complexas</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Relatórios/Dashboards</label>
                <select id="relatorios${index}" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="Não">Não</option>
                    <option value="Sim - Básicos" selected>Sim - Básicos</option>
                    <option value="Sim - Avançados">Sim - Avançados</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Permissões</label>
                <select id="permissoes${index}" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="Padrão">Padrão</option>
                    <option value="Média" selected>Média</option>
                    <option value="Alta">Alta</option>
                </select>
            </div>
        </div>
        
        <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Fases do Processo</label>
            <div class="flex flex-wrap gap-2">
                ${processo.fases.map(fase => `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${fase}</span>`).join('')}
            </div>
        </div>
    `;
    return card;
}

function gerarEstimativa() {
    // Coletar dados dos processos
    processosConfigurados = processosRH.map((processo, index) => ({
        ...processo,
        complexidadeCampos: document.getElementById(`complexidadeCampos${index}`).value,
        automacoes: document.getElementById(`automacoes${index}`).value,
        integracoes: document.getElementById(`integracoes${index}`).value,
        basesDados: document.getElementById(`basesDados${index}`).value,
        relatorios: document.getElementById(`relatorios${index}`).value,
        permissoes: document.getElementById(`permissoes${index}`).value
    }));
    
    // Identificar projetos similares
    const projetosSimilares = identificarProjetosSimilares();
    
    // Calcular estimativa
    const estimativa = calcularEstimativa(projetosSimilares);
    
    // Exibir resultados
    exibirEstimativa(estimativa, projetosSimilares);
}

function identificarProjetosSimilares() {
    return dadosHistoricos.filter(projeto => {
        let score = 0;
        
        // Área (peso 3)
        if (projeto.area === 'RH') score += 3;
        
        // Tamanho do cliente (peso 2)
        if (projeto.tamanhoCliente === dadosProjeto.tamanhoCliente) score += 2;
        
        // Número de pipes similar (peso 2)
        if (Math.abs(projeto.numPipes - 3) <= 1) score += 2;
        
        // Complexidade geral (peso 1)
        const complexidadeEstimada = estimarComplexidadeGeral();
        if (projeto.complexidade === complexidadeEstimada) score += 1;
        
        return score >= 3; // Threshold para similaridade
    }).sort((a, b) => b.score - a.score);
}

function estimarComplexidadeGeral() {
    let complexidadeScore = 0;
    
    processosConfigurados.forEach(processo => {
        if (processo.complexidadeCampos === 'Complexos') complexidadeScore += 2;
        else if (processo.complexidadeCampos === 'Médios') complexidadeScore += 1;
        
        if (processo.automacoes === 'Alta') complexidadeScore += 2;
        else if (processo.automacoes === 'Média') complexidadeScore += 1;
        
        if (processo.integracoes.includes('Alta')) complexidadeScore += 2;
        else if (processo.integracoes.includes('Média')) complexidadeScore += 1;
    });
    
    if (complexidadeScore >= 12) return 'Alta';
    if (complexidadeScore >= 6) return 'Média';
    return 'Baixa';
}

function calcularEstimativa(projetosSimilares) {
    let horasBase = 120; // Valor padrão para projetos de RH
    
    if (projetosSimilares.length > 0) {
        horasBase = projetosSimilares.reduce((sum, projeto) => sum + projeto.horasReais, 0) / projetosSimilares.length;
    }
    
    // Ajustes baseados nas características específicas
    let multiplicador = 1;
    
    // Ajuste por tamanho do cliente
    switch (dadosProjeto.tamanhoCliente) {
        case 'Enterprise': multiplicador *= 1.3; break;
        case 'Grande': multiplicador *= 1.1; break;
        case 'Pequeno': multiplicador *= 0.8; break;
    }
    
    // Ajuste por maturidade digital
    switch (dadosProjeto.maturidadeDigital) {
        case 'Baixa': multiplicador *= 1.2; break;
        case 'Alta': multiplicador *= 0.9; break;
    }
    
    // Ajuste por número de usuários
    if (dadosProjeto.numeroUsuarios > 100) multiplicador *= 1.15;
    else if (dadosProjeto.numeroUsuarios < 20) multiplicador *= 0.95;
    
    // Ajuste por urgência
    if (dadosProjeto.expectativaPrazo === 'Urgente') multiplicador *= 1.1;
    
    const horasTotal = Math.round(horasBase * multiplicador);
    
    // Distribuição por fases
    const distribuicao = {
        analise: Math.round(horasTotal * 0.18),
        configuracao: Math.round(horasTotal * 0.35),
        basesDados: Math.round(horasTotal * 0.08),
        integracoes: Math.round(horasTotal * 0.15),
        testes: Math.round(horasTotal * 0.12),
        treinamento: Math.round(horasTotal * 0.08),
        documentacao: Math.round(horasTotal * 0.04)
    };
    
    return {
        horasTotal,
        distribuicao,
        multiplicador,
        horasBase
    };
}

function exibirEstimativa(estimativa, projetosSimilares) {
    const container = document.getElementById('estimativa-container');
    
    container.innerHTML = `
        <!-- Resumo Executivo -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-2xl font-bold">${estimativa.horasTotal} Horas</h3>
                    <p class="text-blue-100">Estimativa total para implementação</p>
                </div>
                <div class="text-right">
                    <p class="text-lg font-semibold">${Math.round(estimativa.horasTotal / 8)} dias úteis</p>
                    <p class="text-blue-100">Considerando 8h/dia</p>
                </div>
            </div>
        </div>
        
        <!-- Projetos Similares -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
                <i class="fas fa-search mr-2 text-blue-500"></i>
                Análise de Similaridade
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${projetosSimilares.map(projeto => `
                    <div class="bg-white p-4 rounded border">
                        <h4 class="font-medium">${projeto.id}</h4>
                        <p class="text-sm text-gray-600">${projeto.casoUso}</p>
                        <p class="text-lg font-bold text-blue-600">${projeto.horasReais}h</p>
                    </div>
                `).join('')}
            </div>
            <p class="text-sm text-gray-600 mt-4">
                <strong>Base de cálculo:</strong> ${estimativa.horasBase.toFixed(0)}h (média dos projetos similares) × ${estimativa.multiplicador.toFixed(2)} (ajustes específicos)
            </p>
        </div>
        
        <!-- Distribuição por Fases -->
        <div class="bg-white border rounded-lg overflow-hidden mb-6">
            <div class="bg-gray-50 px-6 py-3 border-b">
                <h3 class="text-lg font-semibold flex items-center">
                    <i class="fas fa-chart-pie mr-2 text-blue-500"></i>
                    Distribuição por Fase
                </h3>
            </div>
            <div class="p-6">
                <div class="space-y-4">
                    ${Object.entries(estimativa.distribuicao).map(([fase, horas]) => {
                        const nomes = {
                            analise: 'Análise e Desenho da Solução',
                            configuracao: 'Configuração dos Pipes & Workflows',
                            basesDados: 'Configuração de Bases de Dados',
                            integracoes: 'Configuração de Integrações',
                            testes: 'Testes e Ajustes (UAT)',
                            treinamento: 'Treinamento',
                            documentacao: 'Documentação'
                        };
                        const percentual = (horas / estimativa.horasTotal * 100).toFixed(1);
                        return `
                            <div class="flex items-center justify-between p-3 border rounded">
                                <span class="font-medium">${nomes[fase]}</span>
                                <div class="flex items-center space-x-4">
                                    <div class="w-32 bg-gray-200 rounded-full h-2">
                                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${percentual}%"></div>
                                    </div>
                                    <span class="font-semibold text-blue-600 w-16 text-right">${horas}h</span>
                                    <span class="text-gray-500 w-12 text-right">${percentual}%</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        
        <!-- Fatores de Risco -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center text-yellow-800">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Fatores de Risco e Premissas
            </h3>
            <ul class="space-y-2 text-sm">
                <li class="flex items-start"><i class="fas fa-circle text-yellow-500 text-xs mt-1.5 mr-2"></i>Disponibilidade do cliente para validações e testes</li>
                <li class="flex items-start"><i class="fas fa-circle text-yellow-500 text-xs mt-1.5 mr-2"></i>Clareza dos processos de RH já mapeados</li>
                <li class="flex items-start"><i class="fas fa-circle text-yellow-500 text-xs mt-1.5 mr-2"></i>Acesso aos sistemas para integrações</li>
                <li class="flex items-start"><i class="fas fa-circle text-yellow-500 text-xs mt-1.5 mr-2"></i>Mudanças de escopo podem impactar até 20% nas horas</li>
            </ul>
        </div>
        
        <!-- Recomendações -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center text-green-800">
                <i class="fas fa-lightbulb mr-2"></i>
                Próximos Passos Recomendados
            </h3>
            <ul class="space-y-2 text-sm">
                <li class="flex items-start"><i class="fas fa-check-circle text-green-500 text-xs mt-1.5 mr-2"></i>Validar o mapeamento detalhado dos 3 processos de RH</li>
                <li class="flex items-start"><i class="fas fa-check-circle text-green-500 text-xs mt-1.5 mr-2"></i>Confirmar necessidades específicas de integrações</li>
                <li class="flex items-start"><i class="fas fa-check-circle text-green-500 text-xs mt-1.5 mr-2"></i>Definir cronograma considerando disponibilidade da equipe de RH</li>
                <li class="flex items-start"><i class="fas fa-check-circle text-green-500 text-xs mt-1.5 mr-2"></i>Agendar sessão de alinhamento de expectativas</li>
            </ul>
        </div>
    `;
}

function exportEstimativa() {
    // Implementar exportação para PDF
    alert('Funcionalidade de exportação em desenvolvimento. Por enquanto, você pode usar Ctrl+P para imprimir.');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar(1);
});