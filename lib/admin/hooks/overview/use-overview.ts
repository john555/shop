import { gql, useQuery } from '@apollo/client';
import {
  FolderOpen,
  LucideIcon,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { StoreOverview, ActivityType, RecentActivity } from '@/types/api';

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
        id
        type
        title
        description
        timestamp
        user {
          name
          avatar
        }
      }
    }
  }
`;

export interface UseOverviewProps {
  storeId: string;
  pollInterval?: number; // Optional polling interval in milliseconds
}

type StoreOverviewData = Omit<StoreOverview, 'recentActivities'> & {
  recentActivities: Array<RecentActivity & { icon: LucideIcon }>;
};

export interface UseOverviewResult {
  overview: StoreOverviewData | null;
  loading: boolean;
  error: any;
  refetch: () => Promise<any>;
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case ActivityType.ProductAdded:
      return Package;
    case ActivityType.CollectionCreated:
      return FolderOpen;
    case ActivityType.CustomerRegistered:
      return Users;
    case ActivityType.OrderReceived:
      return ShoppingCart;
  }
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

  const overview = data?.storeOverview
    ? {
        ...data.storeOverview,
        recentActivities: data.storeOverview.recentActivities.map(
          (activity: any) => ({
            id: activity.id,
            icon: getActivityIcon(activity.type),
            title: activity.title,
            description: activity.description,
            timestamp: new Date(activity.timestamp).toISOString(),
            user: activity.user,
          })
        ),
      }
    : null;

  return {
    overview,
    loading,
    error,
    refetch,
  };
}
