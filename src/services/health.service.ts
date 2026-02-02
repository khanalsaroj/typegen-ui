import apiClient from './apiClient';
import type { HealthStatus } from '@/types';

const prefixUrl = '/api/v1';

class HealthService {
  async getHealth(): Promise<HealthStatus> {
    return apiClient.get<HealthStatus>(prefixUrl + '/health');
  }
}

export const healthService = new HealthService();
