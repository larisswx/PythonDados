// JavaScript para IA Estimador Pipefy

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const form = document.getElementById('estimateForm');
    const resultCard = document.getElementById('resultCard');
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    const alertArea = document.getElementById('alertArea');
    
    // Checkboxes que mostram/escondem campos
    const temIntegracoes = document.getElementById('tem_integracoes');
    const temMigracao = document.getElementById('tem_migracao');
    
    // Grupos de campos condicionais
    const numIntegracoesGroup = document.getElementById('num_integracoes_group');
    const complexidadeIntegracoesGroup = document.getElementById('complexidade_integracoes_group');
    const volumeDadosGroup = document.getElementById('volume_dados_group');
    
    // Elementos de resultado
    const horasEstimadas = document.getElementById('horasEstimadas');
    const diasEstimados = document.getElementById('diasEstimados');
    const horasMinimas = document.getElementById('horasMinimas');
    const horasMaximas = document.getElementById('horasMaximas');
    
    // Botões
    const generateDataBtn = document.getElementById('generateDataBtn');
    const retrainBtn = document.getElementById('retrainBtn');
    const statusBtn = document.getElementById('statusBtn');
    
    // Configurar eventos de checkbox
    temIntegracoes.addEventListener('change', function() {
        const show = this.checked;
        numIntegracoesGroup.style.display = show ? 'block' : 'none';
        complexidadeIntegracoesGroup.style.display = show ? 'block' : 'none';
        
        if (!show) {
            document.getElementById('num_integracoes').value = 0;
        } else {
            document.getElementById('num_integracoes').value = 1;
        }
    });
    
    temMigracao.addEventListener('change', function() {
        const show = this.checked;
        volumeDadosGroup.style.display = show ? 'block' : 'none';
    });
    
    // Configurar formulário de estimativa
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularEstimativa();
    });
    
    // Botões de ação
    generateDataBtn.addEventListener('click', gerarDadosExemplo);
    retrainBtn.addEventListener('click', retreinarModelo);
    statusBtn.addEventListener('click', verificarStatus);
    
    // Carregar status inicial
    verificarStatus();
    
    // Função para calcular estimativa
    async function calcularEstimativa() {
        showLoading('Calculando estimativa...');
        
        try {
            const formData = {
                projeto_nome: document.getElementById('projeto_nome').value || 'Novo Projeto',
                cliente: document.getElementById('cliente').value || 'Cliente',
                num_processos: parseInt(document.getElementById('num_processos').value),
                complexidade_media: parseInt(document.getElementById('complexidade_media').value),
                num_departamentos: parseInt(document.getElementById('num_departamentos').value),
                num_usuarios: parseInt(document.getElementById('num_usuarios').value),
                tem_integracoes: document.getElementById('tem_integracoes').checked,
                num_integracoes: parseInt(document.getElementById('num_integracoes').value) || 0,
                complexidade_integracoes: parseInt(document.getElementById('complexidade_integracoes').value),
                tem_migracao: document.getElementById('tem_migracao').checked,
                volume_dados: parseInt(document.getElementById('volume_dados').value),
                nivel_customizacao_relatorios: parseInt(document.getElementById('nivel_customizacao_relatorios').value),
                necessita_automacoes_avancadas: document.getElementById('necessita_automacoes_avancadas').checked,
                experiencia_equipe_cliente: parseInt(document.getElementById('experiencia_equipe_cliente').value),
                necessita_treinamento_extensivo: document.getElementById('necessita_treinamento_extensivo').checked
            };
            
            const response = await fetch('/estimate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                mostrarResultado(result.estimativa);
                showAlert('success', 'Estimativa calculada com sucesso!');
            } else {
                throw new Error(result.error || 'Erro ao calcular estimativa');
            }
            
        } catch (error) {
            console.error('Erro:', error);
            showAlert('danger', 'Erro ao calcular estimativa: ' + error.message);
        } finally {
            hideLoading();
        }
    }
    
    // Função para mostrar resultado
    function mostrarResultado(estimativa) {
        horasEstimadas.textContent = Math.round(estimativa.horas_estimadas);
        diasEstimados.textContent = estimativa.dias_estimados;
        horasMinimas.textContent = Math.round(estimativa.horas_minimas) + 'h';
        horasMaximas.textContent = Math.round(estimativa.horas_maximas) + 'h';
        
        // Mostrar card de resultado com animação
        resultCard.style.display = 'block';
        resultCard.classList.add('fade-in-up');
        
        // Scroll para o resultado
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Função para gerar dados de exemplo
    async function gerarDadosExemplo() {
        showLoading('Gerando dados de exemplo...');
        
        try {
            const response = await fetch('/generate_sample_data', {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('success', result.message);
                verificarStatus(); // Atualizar status
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('Erro:', error);
            showAlert('danger', 'Erro ao gerar dados: ' + error.message);
        } finally {
            hideLoading();
        }
    }
    
    // Função para retreinar modelo
    async function retreinarModelo() {
        showLoading('Treinando modelo de IA...');
        
        try {
            const response = await fetch('/train', {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('success', 'Modelo treinado com sucesso!');
                verificarStatus(); // Atualizar status
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('Erro:', error);
            showAlert('danger', 'Erro ao treinar modelo: ' + error.message);
        } finally {
            hideLoading();
        }
    }
    
    // Função para verificar status do sistema
    async function verificarStatus() {
        try {
            const response = await fetch('/status');
            const result = await response.json();
            
            if (result.success) {
                atualizarStatusDisplay(result.status);
            }
            
        } catch (error) {
            console.error('Erro ao verificar status:', error);
            document.getElementById('systemStatus').innerHTML = `
                <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-circle text-danger me-2"></i>
                    <span>Erro ao verificar status</span>
                </div>
            `;
        }
    }
    
    // Função para atualizar display de status
    function atualizarStatusDisplay(status) {
        let statusHtml = '';
        
        // Status do modelo
        const modelStatus = status.model_trained ? 
            '<i class="fas fa-circle text-success me-2"></i>Modelo treinado' :
            '<i class="fas fa-circle text-warning me-2"></i>Modelo não treinado';
        
        // Status dos dados
        const dataStatus = status.data_file_exists ? 
            `<i class="fas fa-circle text-success me-2"></i>Dados disponíveis (${status.num_projects || 0} projetos)` :
            '<i class="fas fa-circle text-danger me-2"></i>Dados não encontrados';
        
        statusHtml = `
            <div class="d-flex align-items-center mb-2">
                ${modelStatus}
            </div>
            <div class="d-flex align-items-center mb-2">
                ${dataStatus}
            </div>
        `;
        
        if (status.data_date_range) {
            statusHtml += `
                <div class="mt-2 text-muted small">
                    <div>Média: ${Math.round(status.data_date_range.mean_hours)}h</div>
                    <div>Min-Max: ${Math.round(status.data_date_range.min_hours)}h - ${Math.round(status.data_date_range.max_hours)}h</div>
                </div>
            `;
        }
        
        document.getElementById('systemStatus').innerHTML = statusHtml;
    }
    
    // Função para mostrar loading
    function showLoading(text = 'Processando...') {
        document.getElementById('loadingText').textContent = text;
        loadingModal.show();
    }
    
    // Função para esconder loading
    function hideLoading() {
        loadingModal.hide();
    }
    
    // Função para mostrar alertas
    function showAlert(type, message) {
        const alertClass = {
            'success': 'alert-success',
            'danger': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';
        
        const iconClass = {
            'success': 'fa-check-circle',
            'danger': 'fa-exclamation-triangle',
            'warning': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        }[type] || 'fa-info-circle';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <i class="fas ${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertArea.innerHTML = alertHtml;
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            const alert = alertArea.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
    
    // Validação de formulário em tempo real
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < parseInt(this.min)) {
                this.value = this.min;
            }
            if (this.value > parseInt(this.max)) {
                this.value = this.max;
            }
        });
    });
    
    // Adicionar tooltips para campos complexos
    const tooltips = [
        {
            element: document.getElementById('complexidade_media'),
            text: 'Complexidade baseada em número de fases, campos condicionais e regras'
        },
        {
            element: document.getElementById('experiencia_equipe_cliente'),
            text: 'Nível de experiência prévia da equipe com Pipefy'
        }
    ];
    
    tooltips.forEach(tooltip => {
        if (tooltip.element) {
            tooltip.element.setAttribute('title', tooltip.text);
            tooltip.element.setAttribute('data-bs-toggle', 'tooltip');
        }
    });
    
    // Inicializar tooltips do Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Adicionar animações nos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});