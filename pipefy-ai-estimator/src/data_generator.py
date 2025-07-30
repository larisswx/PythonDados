"""
Gerador de dados de exemplo para projetos de implementação Pipefy
"""
import pandas as pd
import numpy as np
from data_models import PipefyProject
import random
from typing import List

def generate_sample_projects(num_projects: int = 50) -> List[PipefyProject]:
    """
    Gera projetos de exemplo com dados realistas baseados em padrões 
    comuns de implementação Pipefy
    """
    projects = []
    
    # Nomes de empresas fictícias
    company_names = [
        "TechCorp", "InnovaSoft", "MegaRetail", "FinanceMax", "HealthPlus",
        "EduTech", "LogisTrans", "GreenEnergy", "FastFood Chain", "LuxuryBrand",
        "StartupX", "GlobalManuf", "LocalBank", "ServicePro", "ConsultCorp",
        "AutoParts", "FashionHouse", "SportGear", "TravelAgency", "RealEstate",
        "MediaGroup", "CloudSoft", "DataTech", "SecureIT", "MobileApp",
        "WebDev", "DigitalMkt", "SocialNet", "GameStudio", "AICompany"
    ]
    
    for i in range(num_projects):
        # Gerar características correlacionadas de forma realística
        
        # Tamanho da empresa (influencia outros fatores)
        empresa_size = random.choice(['pequena', 'media', 'grande'])
        
        if empresa_size == 'pequena':
            num_usuarios = random.randint(5, 50)
            num_departamentos = random.randint(1, 3)
            num_processos = random.randint(1, 3)
        elif empresa_size == 'media':
            num_usuarios = random.randint(30, 200)
            num_departamentos = random.randint(2, 8)
            num_processos = random.randint(2, 8)
        else:  # grande
            num_usuarios = random.randint(100, 1000)
            num_departamentos = random.randint(5, 20)
            num_processos = random.randint(5, 15)
        
        # Complexidade média correlacionada com número de processos
        if num_processos <= 2:
            complexidade_media = random.choices([1, 2, 3], weights=[0.4, 0.4, 0.2])[0]
        elif num_processos <= 5:
            complexidade_media = random.choices([2, 3, 4], weights=[0.3, 0.4, 0.3])[0]
        else:
            complexidade_media = random.choices([3, 4, 5], weights=[0.3, 0.4, 0.3])[0]
        
        # Integrações mais comuns em empresas maiores
        tem_integracoes = random.choices([True, False], 
                                       weights=[0.7, 0.3] if empresa_size != 'pequena' else [0.3, 0.7])[0]
        
        num_integracoes = 0
        complexidade_integracoes = 1
        if tem_integracoes:
            if empresa_size == 'pequena':
                num_integracoes = random.randint(1, 2)
                complexidade_integracoes = random.choices([1, 2, 3], weights=[0.5, 0.3, 0.2])[0]
            elif empresa_size == 'media':
                num_integracoes = random.randint(1, 5)
                complexidade_integracoes = random.choices([2, 3, 4], weights=[0.3, 0.4, 0.3])[0]
            else:
                num_integracoes = random.randint(2, 10)
                complexidade_integracoes = random.choices([3, 4, 5], weights=[0.3, 0.4, 0.3])[0]
        
        # Migração de dados
        tem_migracao = random.choices([True, False], weights=[0.6, 0.4])[0]
        volume_dados = 1
        if tem_migracao:
            if empresa_size == 'pequena':
                volume_dados = random.choices([1, 2, 3], weights=[0.5, 0.3, 0.2])[0]
            elif empresa_size == 'media':
                volume_dados = random.choices([2, 3, 4], weights=[0.3, 0.4, 0.3])[0]
            else:
                volume_dados = random.choices([3, 4, 5], weights=[0.3, 0.4, 0.3])[0]
        
        # Outras características
        nivel_customizacao_relatorios = random.choices([1, 2, 3, 4, 5], 
                                                      weights=[0.2, 0.3, 0.3, 0.15, 0.05])[0]
        
        necessita_automacoes_avancadas = random.choices([True, False], 
                                                       weights=[0.4, 0.6])[0]
        
        experiencia_equipe_cliente = random.choices([1, 2, 3, 4, 5], 
                                                   weights=[0.3, 0.3, 0.25, 0.1, 0.05])[0]
        
        necessita_treinamento_extensivo = random.choices([True, False], 
                                                        weights=[0.6, 0.4] if experiencia_equipe_cliente <= 2 else [0.3, 0.7])[0]
        
        # Calcular horas baseado nas características (fórmula realística)
        horas_base = num_processos * 8  # 8h por processo básico
        
        # Multiplicadores baseados em complexidade
        fator_complexidade = 0.5 + (complexidade_media * 0.3)
        fator_usuarios = 1 + (num_usuarios / 1000) * 0.5  # Escala com usuários
        fator_departamentos = 1 + (num_departamentos * 0.1)
        
        # Adicionar tempo para integrações
        horas_integracoes = 0
        if tem_integracoes:
            horas_integracoes = num_integracoes * complexidade_integracoes * 4
        
        # Adicionar tempo para migração
        horas_migracao = 0
        if tem_migracao:
            horas_migracao = volume_dados * 6
        
        # Adicionar tempo para customizações
        horas_customizacao = nivel_customizacao_relatorios * 3
        
        # Adicionar tempo para automações avançadas
        horas_automacoes = 15 if necessita_automacoes_avancadas else 0
        
        # Adicionar tempo para treinamento
        horas_treinamento = 0
        if necessita_treinamento_extensivo:
            horas_treinamento = (num_usuarios / 10) * (6 - experiencia_equipe_cliente)
        
        # Calcular total com variação aleatória realística
        horas_totais = (horas_base * fator_complexidade * fator_usuarios * fator_departamentos + 
                       horas_integracoes + horas_migracao + horas_customizacao + 
                       horas_automacoes + horas_treinamento)
        
        # Adicionar variação aleatória de ±20%
        variacao = random.uniform(0.8, 1.2)
        horas_totais *= variacao
        
        # Arredondar para número realístico
        horas_totais = round(horas_totais, 1)
        
        project = PipefyProject(
            projeto_nome=f"Projeto {i+1:03d}",
            cliente=random.choice(company_names) + f" {random.randint(1, 999)}",
            num_processos=num_processos,
            complexidade_media=complexidade_media,
            num_departamentos=num_departamentos,
            num_usuarios=num_usuarios,
            tem_integracoes=tem_integracoes,
            num_integracoes=num_integracoes,
            complexidade_integracoes=complexidade_integracoes,
            tem_migracao=tem_migracao,
            volume_dados=volume_dados,
            nivel_customizacao_relatorios=nivel_customizacao_relatorios,
            necessita_automacoes_avancadas=necessita_automacoes_avancadas,
            experiencia_equipe_cliente=experiencia_equipe_cliente,
            necessita_treinamento_extensivo=necessita_treinamento_extensivo,
            horas_totais_real=horas_totais
        )
        
        projects.append(project)
    
    return projects

def save_projects_to_excel(projects: List[PipefyProject], filename: str):
    """Salva projetos em arquivo Excel"""
    data = [project.to_dict() for project in projects]
    df = pd.DataFrame(data)
    
    # Reordenar colunas para melhor visualização
    column_order = [
        'projeto_nome', 'cliente', 'horas_totais_real',
        'num_processos', 'complexidade_media', 'num_departamentos', 'num_usuarios',
        'tem_integracoes', 'num_integracoes', 'complexidade_integracoes',
        'tem_migracao', 'volume_dados',
        'nivel_customizacao_relatorios', 'necessita_automacoes_avancadas',
        'experiencia_equipe_cliente', 'necessita_treinamento_extensivo'
    ]
    
    df = df[column_order]
    df.to_excel(filename, index=False)
    print(f"Dados salvos em {filename}")
    print(f"Total de projetos: {len(projects)}")
    print(f"Estatísticas de horas:")
    print(f"  Mínimo: {df['horas_totais_real'].min():.1f}h")
    print(f"  Máximo: {df['horas_totais_real'].max():.1f}h") 
    print(f"  Média: {df['horas_totais_real'].mean():.1f}h")
    print(f"  Mediana: {df['horas_totais_real'].median():.1f}h")

if __name__ == "__main__":
    # Gerar dados de exemplo
    projects = generate_sample_projects(100)  # 100 projetos de exemplo
    save_projects_to_excel(projects, "../data/projetos_historicos.xlsx")