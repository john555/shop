import { gql, useMutation, useQuery } from '@apollo/client';
import { Order, OrderCreateInput, OrderUpdateInput } from '@/types/api';
import { formatDatesInObject } from '@/common/date';

const ORDER_FIELDS = `
  id
  orderNumber
  formattedOrderNumber
  status
  paymentStatus
  shipmentStatus
  subtotalAmount
  taxAmount
  shippingAmount
  discountAmount
  totalAmount
  formattedTotalAmount
  currency
  currencySymbol
  customerNotes
  privateNotes
  trackingNumber
  trackingUrl
  createdAt
  updatedAt
  paidAt
  shippedAt
  deliveredAt
  cancelledAt
  customer {
    id
    firstName
    lastName
    email
    phoneNumber
  }
  items {
    id
    productId
    variantId
    title
    variantName
    sku
    unitPrice
    quantity
    subtotal
    taxAmount
    discountAmount
    totalAmount
  }
`;

const GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      ${ORDER_FIELDS}
    }
  }
`;

const CREATE_DRAFT_ORDER = gql`
  mutation CreateDraftOrder($input: OrderCreateInput!) {
    createDraftOrder(input: $input) {
      ${ORDER_FIELDS}
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrder($input: OrderUpdateInput!) {
    updateOrder(input: $input) {
      ${ORDER_FIELDS}
    }
  }
`;

interface UseOrderProps {
  id?: string;
}

export function useOrder({ id }: UseOrderProps = {}) {
  const {
    data,
    loading,
    error: orderError,
    refetch,
  } = useQuery(GET_ORDER, {
    variables: { id },
    skip: !id,
  });

  const [createDraftOrder, { loading: creating, error: createError }] =
    useMutation(CREATE_DRAFT_ORDER, {
      refetchQueries: [{ query: GET_ORDER, variables: { id } }],
    });

  const [updateOrder, { loading: updating, error: updateError }] = useMutation(
    UPDATE_ORDER,
    {
      refetchQueries: [{ query: GET_ORDER, variables: { id } }],
    }
  );

  // Combine error states
  const error = orderError || createError || updateError;

  return {
    order: formatDatesInObject(data?.order) as Order | null,
    loading,
    creating,
    updating,
    error,
    createDraftOrder: async (input: OrderCreateInput) => {
      const response = await createDraftOrder({
        variables: { input },
      });
      return response.data.createDraftOrder as Order;
    },
    updateOrder: async (input: Omit<OrderUpdateInput, 'id'>) => {
      const response = await updateOrder({
        variables: { input: { ...input, id } },
      });
      return response.data.updateOrder as Order;
    },
    refetch,
  };
}
