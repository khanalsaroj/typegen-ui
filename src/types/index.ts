import {
  MapperAdvancedOptions,
  MapperSupportedLanguage,
  SupportedLanguage,
} from '@/types/generator.types.ts';

export type DatabaseType = 'mysql' | 'postgres' | 'oracle' | 'mssql';

export type Status = {
  isConnected?: boolean;
  tableInfo?: TableInfo[];
  lastCheckedAt?: string;
  isChecking: boolean;
};

export interface DatabaseConnection {
  connectionId: number;
  name: string;
  dbType: DatabaseType;
  host: string;
  port: number;
  databaseName: string;
  schemaName?: string;
  username: string;
  password?: string;
}

export type DatabaseConnectionStatus = DatabaseConnection & Status;

export interface DatabaseConnectionInfo {
  dbType: string;
  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;
  schemaName: string;
}

export interface TypeRequest {
  connectionId: number;
  options: unknown; // maps to json.RawMessage
  prefix?: string;
  suffix?: string;
  style?: string;
  language: SupportedLanguage;
  tableNames?: string[];
}

export interface TableInfo {
  name: string;
  columnCount: number;
}

export interface ConnectResponse {
  message: string;
  success: boolean;
  pingMs?: number;
  tablesFound?: number;
  sizeMb?: number;
  tables: TableInfo[];
  databaseInfo?: DatabaseConnectionInfo;
}

export interface SchemaColumn {
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  defaultValue?: string;
  references?: {
    table: string;
    column: string;
  };
}

export interface SchemaTable {
  name: string;
  schema: string;
  columns: SchemaColumn[];
  rowCount?: number;
}

export interface DatabaseSchema {
  name: string;
  tables: SchemaTable[];
}

export interface GeneratedArtifact {
  id: string;
  connectionId: string;
  tables: string[];
  language: SupportedLanguage;
  content: string;
  fileName: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  database: {
    connected: boolean;
    latency: number;
  };
}

export interface Meta {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface MapperRequest {
  connectionId: number;
  options: MapperAdvancedOptions;
  targetType: MapperSupportedLanguage;
  tableName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: Meta;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

export interface DatabaseConnectionHealth {
  connectionId: number;
  name: string;
  status: ConnectionStatus;
  lastCheckedAt?: string;
  lastError?: string;
}
