# 🤖 IA Estimador Pipefy

Sistema de Inteligência Artificial para estimativa automatizada de horas de implementação de projetos Pipefy.

## 📋 Sobre o Projeto

Este sistema utiliza Machine Learning para analisar características de projetos Pipefy e fornecer estimativas precisas de tempo de implementação baseadas em dados históricos. A ferramenta ajuda consultores e equipes a planejar melhor seus projetos e fornecer estimativas mais assertivas aos clientes.

## ✨ Funcionalidades

- **🎯 Estimativa Inteligente**: Usa algoritmos de ML para prever horas de implementação
- **📊 Interface Web Moderna**: Interface responsiva e intuitiva
- **📈 Análise de Dados**: Visualização da importância das diferentes variáveis
- **🔄 Retreinamento Contínuo**: Sistema aprende com novos projetos
- **📋 Intervalos de Confiança**: Fornece estimativas mínimas, médias e máximas
- **🏗️ Geração de Dados**: Cria dados de exemplo para treinamento inicial

## 🚀 Funcionalidades Principais

### Variáveis de Entrada
- **Informações Básicas**: Número de processos, complexidade média, departamentos, usuários
- **Integrações**: Quantidade e complexidade das integrações necessárias
- **Migração de Dados**: Volume e necessidade de migração
- **Customizações**: Nível de personalização de relatórios e automações
- **Equipe**: Experiência da equipe cliente e necessidade de treinamento

### Saídas do Sistema
- **Estimativa Principal**: Horas estimadas para implementação
- **Intervalos de Confiança**: Cenários otimista, realista e pessimista
- **Conversão Automática**: Estimativas em horas e dias úteis
- **Nível de Confiança**: Indicador da precisão da estimativa

## 🛠️ Tecnologias Utilizadas

- **Backend**: Python, Flask, scikit-learn
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Machine Learning**: Random Forest, Gradient Boosting
- **Dados**: pandas, numpy, openpyxl
- **Visualização**: matplotlib, plotly, seaborn

## 📁 Estrutura do Projeto

```
pipefy-ai-estimator/
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── README.md             # Documentação
├── data/                 # Dados históricos
│   └── projetos_historicos.xlsx
├── models/               # Modelos treinados
│   ├── pipefy_estimator.pkl
│   └── feature_importance.png
├── src/                  # Código fonte
│   ├── data_models.py    # Modelos de dados
│   ├── data_generator.py # Gerador de dados exemplo
│   └── ml_model.py       # Modelo de Machine Learning
├── templates/            # Templates HTML
│   └── index.html
└── static/              # Arquivos estáticos
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd pipefy-ai-estimator
```

2. **Instale as dependências**
```bash
pip install -r requirements.txt
```

3. **Gere dados de exemplo (primeira execução)**
```bash
cd src
python3 data_generator.py
```

4. **Treine o modelo**
```bash
python3 ml_model.py
```

5. **Execute a aplicação**
```bash
cd ..
python3 app.py
```

6. **Acesse a aplicação**
```
http://localhost:8080
```

## 📖 Como Usar

### Interface Web

1. **Preencha os dados do projeto**:
   - Nome do projeto e cliente
   - Características técnicas (processos, complexidade, usuários)
   - Requisitos de integração e migração
   - Necessidades de customização

2. **Clique em "Calcular Estimativa"**

3. **Visualize os resultados**:
   - Estimativa principal em horas e dias
   - Intervalos de confiança (mínimo/máximo)
   - Nível de confiança da predição

### API Endpoints

- `POST /estimate` - Calcular estimativa
- `POST /train` - Retreinar modelo
- `POST /generate_sample_data` - Gerar dados exemplo
- `GET /status` - Status do sistema

## 🧠 Como Funciona o Modelo

### Algoritmo Principal
O sistema usa **Random Forest Regressor** como algoritmo principal por sua:
- Robustez contra overfitting
- Capacidade de lidar com dados não-lineares
- Fornecimento de intervalos de confiança
- Interpretabilidade das features

### Features Mais Importantes
Baseado na análise do modelo:
1. **Número de Usuários** (49.6%) - Principal driver de complexidade
2. **Número de Processos** (35.6%) - Volume de trabalho
3. **Número de Departamentos** (5.0%) - Complexidade organizacional
4. **Integrações** (3.3%) - Complexidade técnica

### Métricas de Performance
- **MAE (Erro Médio Absoluto)**: ~67 horas
- **R² Score**: 0.726 (72.6% de explicação da variância)
- **RMSE**: ~123 horas

## 📊 Adicionando Seus Próprios Dados

Para melhorar a precisão com seus dados reais:

1. **Substitua os dados de exemplo**:
   - Edite `data/projetos_historicos.xlsx`
   - Mantenha a estrutura das colunas
   - Adicione projetos reais com horas conhecidas

2. **Retreine o modelo**:
```bash
cd src
python3 ml_model.py
```

3. **Ou use a interface web**:
   - Clique em "Retreinar" no painel de status

## 🔄 Melhoria Contínua

O sistema é projetado para aprender continuamente:

1. **Coleta de Feedback**: Registre horas reais dos projetos implementados
2. **Adição de Dados**: Inclua novos projetos na base histórica
3. **Retreinamento**: Execute periodicamente o retreinamento
4. **Monitoramento**: Acompanhe as métricas de precisão

## 🎨 Personalização

### Interface
- Modifique `static/css/style.css` para personalizar cores e layout
- Edite `templates/index.html` para ajustar campos e textos

### Modelo
- Ajuste parâmetros em `src/ml_model.py`
- Adicione novas features em `src/data_models.py`
- Teste diferentes algoritmos modificando a classe `PipefyEstimator`

## 🐛 Solução de Problemas

### Erro de Importação
```bash
# Instale as dependências novamente
pip install -r requirements.txt
```

### Modelo Não Encontrado
```bash
# Treine o modelo primeiro
cd src
python3 ml_model.py
```

### Porta em Uso
```bash
# Mude a porta em app.py linha 201
app.run(debug=True, host='0.0.0.0', port=8081)
```

## 📈 Próximas Melhorias

- [ ] Dashboard de analytics com histórico de estimativas
- [ ] API REST completa para integração externa
- [ ] Suporte a múltiplos modelos (A/B testing)
- [ ] Integração direta com CRM/Pipefy
- [ ] Notificações automáticas de retreinamento
- [ ] Exportação de relatórios em PDF

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Suporte

Para dúvidas, sugestões ou problemas:
- Abra uma issue no GitHub
- Entre em contato via email

---

**Desenvolvido com ❤️ para otimizar estimativas de implementação Pipefy**