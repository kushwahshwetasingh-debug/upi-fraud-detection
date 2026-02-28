import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FraudPrediction {
  risk_score: number;
  risk_level: 'safe' | 'medium' | 'high' | 'blocked';
  is_flagged: boolean;
}

export interface FraudRequest {
  amount: number;
  is_night: number;
}

export const predictFraud = async (data: FraudRequest): Promise<FraudPrediction> => {
  const response = await api.post<FraudPrediction>('/predict', data);
  return response.data;
};

export default api;
