"""
Aplicação Web para Estimativa de Implementação Pipefy com IA
"""
from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import sys
import os

# Adicionar src ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.ml_model import PipefyEstimator
from src.data_models import PipefyProject
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Inicializar estimador
estimator = PipefyEstimator()

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/estimate', methods=['POST'])
def estimate():
    """Endpoint para estimativa"""
    try:
        data = request.json
        
        # Criar projeto a partir dos dados
        project = PipefyProject(
            projeto_nome=data.get('projeto_nome', 'Novo Projeto'),
            cliente=data.get('cliente', 'Cliente'),
            num_processos=int(data.get('num_processos', 1)),
            complexidade_media=int(data.get('complexidade_media', 1)),
            num_departamentos=int(data.get('num_departamentos', 1)),
            num_usuarios=int(data.get('num_usuarios', 1)),
            tem_integracoes=bool(data.get('tem_integracoes', False)),
            num_integracoes=int(data.get('num_integracoes', 0)),
            complexidade_integracoes=int(data.get('complexidade_integracoes', 1)),
            tem_migracao=bool(data.get('tem_migracao', False)),
            volume_dados=int(data.get('volume_dados', 1)),
            nivel_customizacao_relatorios=int(data.get('nivel_customizacao_relatorios', 1)),
            necessita_automacoes_avancadas=bool(data.get('necessita_automacoes_avancadas', False)),
            experiencia_equipe_cliente=int(data.get('experiencia_equipe_cliente', 1)),
            necessita_treinamento_extensivo=bool(data.get('necessita_treinamento_extensivo', False))
        )
        
        # Verificar se modelo está carregado
        if not estimator.is_trained:
            if not estimator.load_model('models/pipefy_estimator.pkl'):
                return jsonify({
                    'error': 'Modelo não encontrado. Execute o treinamento primeiro.',
                    'success': False
                }), 400
        
        # Fazer predição
        prediction = estimator.predict_project(project)
        
        # Obter intervalos de confiança
        features = project.get_features_for_prediction()
        lower, mean_pred, upper = estimator.get_prediction_intervals(features)
        
        # Converter para dias úteis (8h por dia)
        horas_minimas = lower
        horas_estimadas = prediction
        horas_maximas = upper
        
        dias_minimos = round(horas_minimas / 8, 1)
        dias_estimados = round(horas_estimadas / 8, 1)
        dias_maximos = round(horas_maximas / 8, 1)
        
        # Salvar estimativa (opcional - para histórico)
        estimativa_data = {
            'timestamp': datetime.now().isoformat(),
            'projeto': project.to_dict(),
            'estimativa': {
                'horas_minimas': horas_minimas,
                'horas_estimadas': horas_estimadas,
                'horas_maximas': horas_maximas,
                'dias_minimos': dias_minimos,
                'dias_estimados': dias_estimados,
                'dias_maximos': dias_maximos
            }
        }
        
        return jsonify({
            'success': True,
            'estimativa': estimativa_data['estimativa'],
            'projeto': {
                'nome': project.projeto_nome,
                'cliente': project.cliente
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    """Endpoint para treinar/retreinar modelo"""
    try:
        # Verificar se arquivo de dados existe
        if not os.path.exists('data/projetos_historicos.xlsx'):
            return jsonify({
                'error': 'Arquivo de dados históricos não encontrado.',
                'success': False
            }), 400
        
        # Treinar modelo
        global estimator
        estimator = PipefyEstimator()
        
        df = estimator.load_data('data/projetos_historicos.xlsx')
        X, y = estimator.prepare_features(df)
        results = estimator.train_model(X, y)
        
        return jsonify({
            'success': True,
            'message': 'Modelo treinado com sucesso!',
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/generate_sample_data', methods=['POST'])
def generate_sample_data():
    """Gera dados de exemplo para treinamento"""
    try:
        from src.data_generator import generate_sample_projects, save_projects_to_excel
        
        # Gerar projetos de exemplo
        projects = generate_sample_projects(100)
        
        # Salvar em Excel
        save_projects_to_excel(projects, 'data/projetos_historicos.xlsx')
        
        return jsonify({
            'success': True,
            'message': f'Gerados {len(projects)} projetos de exemplo',
            'file': 'data/projetos_historicos.xlsx'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/download_template')
def download_template():
    """Download do template Excel para upload de dados"""
    try:
        # Verificar se arquivo existe
        template_path = 'data/template_projetos.xlsx'
        if os.path.exists(template_path):
            return send_file(template_path, as_attachment=True)
        else:
            return jsonify({
                'error': 'Template não encontrado',
                'success': False
            }), 404
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/status')
def status():
    """Status do modelo e dados"""
    try:
        status_info = {
            'model_trained': estimator.is_trained,
            'data_file_exists': os.path.exists('data/projetos_historicos.xlsx'),
            'model_file_exists': os.path.exists('models/pipefy_estimator.pkl')
        }
        
        if status_info['data_file_exists']:
            import pandas as pd
            df = pd.read_excel('data/projetos_historicos.xlsx')
            status_info['num_projects'] = len(df)
            status_info['data_date_range'] = {
                'min_hours': float(df['horas_totais_real'].min()),
                'max_hours': float(df['horas_totais_real'].max()),
                'mean_hours': float(df['horas_totais_real'].mean())
            }
        
        return jsonify({
            'success': True,
            'status': status_info
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    # Tentar carregar modelo existente
    estimator.load_model('models/pipefy_estimator.pkl')
    
    # Executar aplicação
    app.run(debug=True, host='0.0.0.0', port=5000)