"""
Modelos de dados para projetos de implementação Pipefy
"""
from dataclasses import dataclass
from typing import Optional, List
import pandas as pd

@dataclass
class PipefyProject:
    """Representa um projeto de implementação Pipefy"""
    
    # Identificação
    projeto_nome: str
    cliente: str
    
    # Características principais
    num_processos: int
    complexidade_media: int  # 1-5 (Baixa=1, Média=3, Alta=5)
    num_departamentos: int
    num_usuarios: int
    
    # Integrações
    tem_integracoes: bool
    num_integracoes: int
    complexidade_integracoes: int  # 1-5
    
    # Migração de dados
    tem_migracao: bool
    volume_dados: int  # 1-5 (Pequeno=1, Médio=3, Grande=5)
    
    # Customizações
    nivel_customizacao_relatorios: int  # 1-5
    necessita_automacoes_avancadas: bool
    
    # Equipe e treinamento
    experiencia_equipe_cliente: int  # 1-5 (Iniciante=1, Avançado=5)
    necessita_treinamento_extensivo: bool
    
    # Resultado (para dados históricos)
    horas_totais_real: Optional[float] = None
    
    def to_dict(self) -> dict:
        """Converte para dicionário para uso com pandas"""
        return {
            'projeto_nome': self.projeto_nome,
            'cliente': self.cliente,
            'num_processos': self.num_processos,
            'complexidade_media': self.complexidade_media,
            'num_departamentos': self.num_departamentos,
            'num_usuarios': self.num_usuarios,
            'tem_integracoes': int(self.tem_integracoes),
            'num_integracoes': self.num_integracoes,
            'complexidade_integracoes': self.complexidade_integracoes,
            'tem_migracao': int(self.tem_migracao),
            'volume_dados': self.volume_dados,
            'nivel_customizacao_relatorios': self.nivel_customizacao_relatorios,
            'necessita_automacoes_avancadas': int(self.necessita_automacoes_avancadas),
            'experiencia_equipe_cliente': self.experiencia_equipe_cliente,
            'necessita_treinamento_extensivo': int(self.necessita_treinamento_extensivo),
            'horas_totais_real': self.horas_totais_real
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        """Cria instância a partir de dicionário"""
        return cls(
            projeto_nome=data['projeto_nome'],
            cliente=data['cliente'],
            num_processos=data['num_processos'],
            complexidade_media=data['complexidade_media'],
            num_departamentos=data['num_departamentos'],
            num_usuarios=data['num_usuarios'],
            tem_integracoes=bool(data['tem_integracoes']),
            num_integracoes=data['num_integracoes'],
            complexidade_integracoes=data['complexidade_integracoes'],
            tem_migracao=bool(data['tem_migracao']),
            volume_dados=data['volume_dados'],
            nivel_customizacao_relatorios=data['nivel_customizacao_relatorios'],
            necessita_automacoes_avancadas=bool(data['necessita_automacoes_avancadas']),
            experiencia_equipe_cliente=data['experiencia_equipe_cliente'],
            necessita_treinamento_extensivo=bool(data['necessita_treinamento_extensivo']),
            horas_totais_real=data.get('horas_totais_real')
        )
    
    def get_features_for_prediction(self) -> List[float]:
        """Retorna features numéricas para predição"""
        return [
            self.num_processos,
            self.complexidade_media,
            self.num_departamentos,
            self.num_usuarios,
            int(self.tem_integracoes),
            self.num_integracoes,
            self.complexidade_integracoes,
            int(self.tem_migracao),
            self.volume_dados,
            self.nivel_customizacao_relatorios,
            int(self.necessita_automacoes_avancadas),
            self.experiencia_equipe_cliente,
            int(self.necessita_treinamento_extensivo)
        ]

def get_feature_names() -> List[str]:
    """Retorna nomes das features para o modelo ML"""
    return [
        'num_processos',
        'complexidade_media', 
        'num_departamentos',
        'num_usuarios',
        'tem_integracoes',
        'num_integracoes',
        'complexidade_integracoes',
        'tem_migracao',
        'volume_dados',
        'nivel_customizacao_relatorios',
        'necessita_automacoes_avancadas',
        'experiencia_equipe_cliente',
        'necessita_treinamento_extensivo'
    ]