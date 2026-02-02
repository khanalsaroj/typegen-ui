import apiClient from './apiClient';
import { ApiResponse, ConnectResponse, DatabaseConnection } from '@/types';

const prefixUrl = '/api/v1';

class DatabaseService {
  async getConnections(): Promise<ApiResponse<DatabaseConnection[]>> {
    return apiClient.get<ApiResponse<DatabaseConnection[]>>(prefixUrl + '/connection');
  }

  async getConnection(id: string): Promise<DatabaseConnection> {
    return apiClient.get<DatabaseConnection>(prefixUrl + `/connection/${id}`);
  }

  async createConnection(input: DatabaseConnection): Promise<DatabaseConnection> {
    return apiClient.post<DatabaseConnection>(prefixUrl + '/connection', input);
  }

  async testConnection(input: DatabaseConnection): Promise<ConnectResponse> {
    return apiClient.post<ConnectResponse>(prefixUrl + '/connection/test', input);
  }

  async deleteConnection(id: number): Promise<void> {
    return apiClient.delete(prefixUrl + `/connection/${id}`);
  }
}

export const databaseService = new DatabaseService();
