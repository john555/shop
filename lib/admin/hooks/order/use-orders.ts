import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Order, OrderStatus, PaymentStatus, ShipmentStatus } from '@/types/admin-api';

const ORDERS_FIELDS = `
  id
  orderNumber
  formattedOrderNumber
  status
  paymentStatus
  shipmentStatus
  subtotalAmount
  totalAmount
  formattedTotalAmount
  currency
  currencySymbol
  createdAt
  customer {
    id
    firstName
    lastName
    email
  }
  items {
    id
    title
    quantity
    totalAmount
  }
`;

const FETCH_STORE_ORDERS = gql`
  query MyStoreOrders(
    $storeId: String!
    $skip: Int
    $take: Int
    $cursor: String
    $filters: OrderFiltersInput
  ) {
    myStoreOrders(
      storeId: $storeId
      skip: $skip
      take: $take
      cursor: $cursor
      filters: $filters
    ) {
      ${ORDERS_FIELDS}
    }
  }
`;

const FETCH_STORE_ORDER_STATS = gql`
  query MyStoreOrderStats($storeId: String!) {
    myStoreOrderStats(storeId: $storeId) {
      counts {
        total
        draft
        pending
        processing
        shipped
        delivered
        cancelled
      }
      totals {
        orders
        tax
        shipping
        discounts
      }
    }
  }
`;

interface OrderFiltersInput {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  shipmentStatus?: ShipmentStatus[];
  searchQuery?: string;
  customerId?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
}

interface UseOrdersProps {
  storeId: string;
  skip?: number;
  take?: number;
  cursor?: string;
  filters?: OrderFiltersInput;
}

export function useOrders({
  storeId,
  skip = 0,
  take = 25,
  cursor,
  filters,
}: UseOrdersProps) {
  // Fetch orders
  const {
    data: ordersData,
    loading: loadingOrders,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery(FETCH_STORE_ORDERS, {
    variables: {
      storeId,
      skip,
      take,
      cursor,
      filters,
    },
    skip: !storeId,
  });

  // Fetch order stats
  const {
    data: statsData,
    loading: loadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(FETCH_STORE_ORDER_STATS, {
    variables: {
      storeId,
    },
    skip: !storeId,
  });

  // Refetch when query parameters change
  useEffect(() => {
    if (storeId) {
      refetchOrders({
        storeId,
        skip,
        take,
        cursor,
        filters,
      });
      refetchStats({
        storeId,
      });
    }
  }, [storeId, skip, take, cursor, filters, refetchOrders, refetchStats]);

  // Combine loading states
  const loading = loadingOrders || loadingStats;

  // Combine error states
  const error = ordersError || statsError;

  return {
    orders: (ordersData?.myStoreOrders || []) as Order[],
    stats: statsData?.myStoreOrderStats || {
      counts: {
        total: 0,
        draft: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      },
      totals: {
        orders: 0,
        tax: 0,
        shipping: 0,
        discounts: 0,
      },
    },
    loading,
    error,
    refetch: () => {
      refetchOrders();
      refetchStats();
    },
  };
}
