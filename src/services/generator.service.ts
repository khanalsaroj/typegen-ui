import apiClient from './apiClient';
import { MapperRequest, TypeRequest } from '@/types';

const prefixUrl = '/api/v1';

class GeneratorService {
  async generateType(options: TypeRequest): Promise<string> {
    return await apiClient.post<string>(prefixUrl + '/type', options, {
      responseType: 'text',
    });
  }

  async generateMapper(options: MapperRequest): Promise<string> {
    return await apiClient.post<string>(prefixUrl + '/mapper', options, {
      responseType: 'text',
    });
  }
}

export const generatorService = new GeneratorService();
export default generatorService;
