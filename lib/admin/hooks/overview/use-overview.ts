import { gql, useQuery } from '@apollo/client';
import { StoreOverview } from '@/types/api';

const STORE_OVERVIEW_QUERY = gql`
  query StoreOverview($storeId: String!) {
    storeOverview(storeId: $storeId) {
      totalProducts
      productsSubtext
      collections
      collectionsSubtext
      customers
      customersSubtext
      totalOrders
      ordersSubtext
      revenue
      revenueGrowth
      averageOrderValue
      orderValueGrowth
      conversionRate
      conversionRateGrowth
      recentOrders {
        id
        customerName
        total
        status
        isNew
      }
      recentActivities {
        type
        message
        userId
        userName
        details
        timestamp
      }
    }
  }
`;

export interface UseOverviewProps {
  storeId: string;
  pollInterval?: number; // Optional polling interval in milliseconds
}

export interface UseOverviewResult {
  overview: StoreOverview | null;
  loading: boolean;
  error: any;
  refetch: () => Promise<any>;
}

/**
 * Hook to fetch store overview data
 * @param storeId - ID of the store to fetch overview for
 * @param pollInterval - Optional interval in milliseconds to poll for updates
 */
export function useOverview({
  storeId,
  pollInterval,
}: UseOverviewProps): UseOverviewResult {
  const { data, loading, error, refetch } = useQuery(STORE_OVERVIEW_QUERY, {
    variables: { storeId },
    skip: !storeId,
    pollInterval, // Will poll at the specified interval if provided
    fetchPolicy: 'cache-and-network', // Always show cached data first, then update from network
    nextFetchPolicy: 'cache-first', // Use cache for subsequent requests
  });

  return {
    overview: data?.storeOverview ?? null,
    loading,
    error,
    refetch,
  };
}
