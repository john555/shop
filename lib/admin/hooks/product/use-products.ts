import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Product, SortOrder } from '@/types/admin-api';

interface ProductFiltersInput {
  categoryId?: string;
  status?: string[];
  search?: string;
}

interface UseProductsProps {
  storeId: string;
  skip?: number;
  take?: number;
  cursor?: string;
  filters?: ProductFiltersInput;
  sortOrder?: SortOrder;
}

const PRODUCTS_FIELDS = `
  id
  title
  description
  slug
  status
  seoTitle
  seoDescription
  price
  compareAtPrice
  sku
  available
  trackInventory
  salesChannels
  categoryId
  createdAt
  updatedAt
  category {
    id
    name
    slug
  }
  options {
    id
    name
    values
  }
  variants {
    id
    optionCombination
    price
    compareAtPrice
    sku
    available
  }
  collections {
    id
    name
    slug
  }
  tags {
    id
    name
    slug
  }
`;

const FETCH_PRODUCTS = gql`
  query MyStoreProducts(
    $storeId: String!
    $skip: Int
    $take: Int
    $cursor: String
    $filters: ProductFiltersInput
    $sortOrder: SortOrder
  ) {
    myStoreProducts(
      storeId: $storeId
      skip: $skip
      take: $take
      cursor: $cursor
      filters: $filters
      sortOrder: $sortOrder
    ) {
      ${PRODUCTS_FIELDS}
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export function useProducts({
  storeId,
  skip = 0,
  take = 25,
  cursor,
  filters,
  sortOrder,
}: UseProductsProps) {
  // Fetch products
  const {
    data,
    loading: loadingProducts,
    error: productsError,
    refetch,
  } = useQuery(FETCH_PRODUCTS, {
    variables: {
      storeId,
      skip,
      take,
      cursor,
      filters,
      sortOrder,
    },
    skip: !storeId,
  });

  // Refetch when query parameters change
  useEffect(() => {
    if (storeId) {
      refetch({
        storeId,
        skip,
        take,
        cursor,
        filters,
        sortOrder,
      });
    }
  }, [storeId, skip, take, cursor, filters, sortOrder, refetch]);

  // Delete product mutation
  const [deleteProduct, { loading: deletingProduct, error: deleteError }] =
    useMutation(DELETE_PRODUCT, {
      refetchQueries: [
        {
          query: FETCH_PRODUCTS,
          variables: {
            storeId,
            skip,
            take,
            cursor,
            filters,
            sortOrder,
          },
        },
      ],
    });

  // Combine loading states
  const loading = loadingProducts || deletingProduct;

  // Combine error states
  const error = productsError || deleteError;

  return {
    products: (data?.myStoreProducts || []) as Product[],
    loading,
    error,
    deleteProduct: async (id: string) => {
      const response = await deleteProduct({
        variables: { id },
      });
      return response.data.deleteProduct;
    },
    refetch,
  };
}
