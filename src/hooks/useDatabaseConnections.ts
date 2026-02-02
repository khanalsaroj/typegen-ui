import { useQuery, useQueries, UseQueryOptions } from '@tanstack/react-query';
import { databaseService } from '@/services/database.service';
import type { DatabaseConnection, DatabaseConnectionStatus } from '@/types';

export function useDatabaseConnections() {
  const connectionsQuery = useQuery<DatabaseConnection[]>({
    queryKey: ['connections'],
    queryFn: async () => {
      const { data } = await databaseService.getConnections();
      return data;
    },
    staleTime: 0,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });

  const statusQueries = useQueries({
    queries:
      connectionsQuery.data?.map(
        (connection): UseQueryOptions<DatabaseConnectionStatus> => ({
          queryKey: ['connection-status', connection.connectionId],
          queryFn: async (): Promise<DatabaseConnectionStatus> => {
            try {
              const result = await databaseService.testConnection(connection);
              return {
                ...connection,
                isConnected: result.success,
                tableInfo: result.tables,
                lastCheckedAt: new Date().toISOString(),
                isChecking: false,
              };
            } catch {
              return {
                ...connection,
                isConnected: false,
                tableInfo: [],
                lastCheckedAt: new Date().toISOString(),
                isChecking: false,
              };
            }
          },
          staleTime: 0,
          refetchInterval: 60_000,
          refetchIntervalInBackground: false,
        }),
      ) ?? [],
  });

  const data: DatabaseConnectionStatus[] | undefined = connectionsQuery.data?.map(
    (connection, index) => {
      const statusQuery = statusQueries[index];

      return {
        ...connection,
        isConnected: statusQuery?.data?.isConnected,
        tableInfo: statusQuery?.data?.tableInfo,
        lastCheckedAt: statusQuery?.data?.lastCheckedAt,
        isChecking: statusQuery?.isLoading ?? false,
      };
    },
  );

  return {
    data,
    isLoading: connectionsQuery.isLoading,
    isError: connectionsQuery.isError,
  };
}
