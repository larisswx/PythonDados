"""
Modelo de Machine Learning para estimativa de horas de implementação Pipefy
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from typing import List, Tuple, Dict
from data_models import PipefyProject, get_feature_names

class PipefyEstimator:
    """Estimador de horas para implementação Pipefy"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = get_feature_names()
        self.is_trained = False
        
    def load_data(self, excel_file: str) -> pd.DataFrame:
        """Carrega dados de projetos históricos"""
        df = pd.read_excel(excel_file)
        print(f"Dados carregados: {len(df)} projetos")
        return df
    
    def prepare_features(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Prepara features e target para treinamento"""
        # Features (X)
        feature_columns = [col for col in self.feature_names if col in df.columns]
        X = df[feature_columns].values
        
        # Target (y)
        y = df['horas_totais_real'].values
        
        print(f"Features shape: {X.shape}")
        print(f"Target shape: {y.shape}")
        
        return X, y
    
    def train_model(self, X: np.ndarray, y: np.ndarray, test_size: float = 0.2) -> Dict:
        """Treina o modelo e retorna métricas"""
        
        # Dividir dados em treino e teste
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # Escalar features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Testar diferentes algoritmos
        models = {
            'RandomForest': RandomForestRegressor(
                n_estimators=100, 
                max_depth=10, 
                min_samples_split=5,
                random_state=42
            ),
            'GradientBoosting': GradientBoostingRegressor(
                n_estimators=100,
                max_depth=8,
                learning_rate=0.1,
                random_state=42
            )
        }
        
        best_model = None
        best_score = float('inf')
        results = {}
        
        for name, model in models.items():
            # Treinar modelo
            model.fit(X_train_scaled, y_train)
            
            # Predições
            y_pred_train = model.predict(X_train_scaled)
            y_pred_test = model.predict(X_test_scaled)
            
            # Métricas
            mae_train = mean_absolute_error(y_train, y_pred_train)
            mae_test = mean_absolute_error(y_test, y_pred_test)
            rmse_test = np.sqrt(mean_squared_error(y_test, y_pred_test))
            r2_test = r2_score(y_test, y_pred_test)
            
            # Cross-validation
            cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, 
                                      scoring='neg_mean_absolute_error')
            
            results[name] = {
                'mae_train': mae_train,
                'mae_test': mae_test,
                'rmse_test': rmse_test,
                'r2_test': r2_test,
                'cv_mae_mean': -cv_scores.mean(),
                'cv_mae_std': cv_scores.std()
            }
            
            print(f"\n{name}:")
            print(f"  MAE Treino: {mae_train:.2f}h")
            print(f"  MAE Teste: {mae_test:.2f}h")
            print(f"  RMSE Teste: {rmse_test:.2f}h")
            print(f"  R² Teste: {r2_test:.3f}")
            print(f"  CV MAE: {-cv_scores.mean():.2f} (±{cv_scores.std():.2f})")
            
            # Selecionar melhor modelo baseado no MAE de teste
            if mae_test < best_score:
                best_score = mae_test
                best_model = model
                self.model = model
        
        self.is_trained = True
        
        # Salvar modelo e scaler
        self.save_model()
        
        # Gerar relatório de importância das features
        self._plot_feature_importance(X_test_scaled, y_test)
        
        return results
    
    def _plot_feature_importance(self, X_test: np.ndarray, y_test: np.ndarray):
        """Plota importância das features"""
        if hasattr(self.model, 'feature_importances_'):
            importance = self.model.feature_importances_
            
            plt.figure(figsize=(10, 8))
            indices = np.argsort(importance)[::-1]
            
            plt.title('Importância das Features')
            plt.bar(range(len(importance)), importance[indices])
            plt.xticks(range(len(importance)), 
                      [self.feature_names[i] for i in indices], 
                      rotation=45, ha='right')
            plt.tight_layout()
            plt.savefig('../models/feature_importance.png', dpi=300, bbox_inches='tight')
            plt.close()
            
            print("\nImportância das Features:")
            for i in indices:
                print(f"  {self.feature_names[i]}: {importance[i]:.3f}")
    
    def predict(self, project_data: List[float]) -> float:
        """Faz predição para um novo projeto"""
        if not self.is_trained:
            raise ValueError("Modelo não foi treinado ainda!")
        
        # Converter para array numpy e escalar
        X = np.array(project_data).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        
        # Predição
        prediction = self.model.predict(X_scaled)[0]
        
        return max(prediction, 1.0)  # Mínimo de 1 hora
    
    def predict_project(self, project: PipefyProject) -> float:
        """Faz predição para um projeto PipefyProject"""
        features = project.get_features_for_prediction()
        return self.predict(features)
    
    def save_model(self, model_path: str = '../models/pipefy_estimator.pkl'):
        """Salva modelo treinado"""
        if self.model is not None:
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'feature_names': self.feature_names,
                'is_trained': self.is_trained
            }
            joblib.dump(model_data, model_path)
            print(f"Modelo salvo em {model_path}")
    
    def load_model(self, model_path: str = '../models/pipefy_estimator.pkl'):
        """Carrega modelo treinado"""
        try:
            model_data = joblib.load(model_path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            self.is_trained = model_data['is_trained']
            print(f"Modelo carregado de {model_path}")
            return True
        except FileNotFoundError:
            print(f"Arquivo de modelo não encontrado: {model_path}")
            return False
    
    def get_prediction_intervals(self, project_data: List[float], confidence: float = 0.8) -> Tuple[float, float, float]:
        """
        Retorna intervalos de confiança para a predição
        Baseado na variação do ensemble do Random Forest
        """
        if not self.is_trained:
            raise ValueError("Modelo não foi treinado ainda!")
        
        # Para Random Forest, podemos usar as predições individuais das árvores
        X = np.array(project_data).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        
        if hasattr(self.model, 'estimators_'):
            # Predições de todas as árvores
            tree_predictions = np.array([tree.predict(X_scaled)[0] for tree in self.model.estimators_])
            
            # Estatísticas
            mean_pred = np.mean(tree_predictions)
            std_pred = np.std(tree_predictions)
            
            # Intervalos baseados em percentis
            alpha = (1 - confidence) / 2
            lower = np.percentile(tree_predictions, alpha * 100)
            upper = np.percentile(tree_predictions, (1 - alpha) * 100)
            
            return max(lower, 1.0), max(mean_pred, 1.0), max(upper, 1.0)
        else:
            # Fallback para outros modelos
            prediction = self.predict(project_data)
            margin = prediction * 0.2  # ±20% como margem padrão
            return max(prediction - margin, 1.0), prediction, prediction + margin

def train_model_from_data(excel_file: str) -> PipefyEstimator:
    """Função auxiliar para treinar modelo a partir de arquivo Excel"""
    estimator = PipefyEstimator()
    
    # Carregar dados
    df = estimator.load_data(excel_file)
    
    # Preparar features
    X, y = estimator.prepare_features(df)
    
    # Treinar modelo
    results = estimator.train_model(X, y)
    
    return estimator

if __name__ == "__main__":
    # Treinar modelo com dados de exemplo
    estimator = train_model_from_data('../data/projetos_historicos.xlsx')