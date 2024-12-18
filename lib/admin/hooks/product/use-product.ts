import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import { Product, ProductCreateInput, ProductUpdateInput } from '@/types/api';

const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
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
    media {
      id
      type
      url
      alt
      position
    }
  }
`;

const FETCH_PRODUCT = gql`
  query Product($id: String!) {
    product(id: $id) {
      ...ProductFields
    }
  }
  ${PRODUCT_FIELDS}
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductCreateInput!) {
    createProduct(input: $input) {
      ...ProductFields
    }
  }
  ${PRODUCT_FIELDS}
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: ProductUpdateInput!) {
    updateProduct(input: $input) {
      ...ProductFields
    }
  }
  ${PRODUCT_FIELDS}
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export function useProduct(initialId?: string) {
  const [id, setId] = useState<string | undefined>(initialId);

  // Query for fetching a single product
  const {
    data: productData,
    loading: loadingProduct,
    error: productError,
    refetch: refetchProduct
  } = useQuery(FETCH_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  // Create product mutation
  const [createProductMutation, { 
    loading: creating,
    error: createError 
  }] = useMutation(CREATE_PRODUCT);

  // Update product mutation
  const [updateProductMutation, { 
    loading: updating,
    error: updateError 
  }] = useMutation(UPDATE_PRODUCT);

  // Delete product mutation
  const [deleteProductMutation, { 
    loading: deleting,
    error: deleteError 
  }] = useMutation(DELETE_PRODUCT);

  // Create product wrapper that handles the response
  const createProduct = useCallback(async (input: ProductCreateInput) => {
    const { data } = await createProductMutation({
      variables: { input }
    });

    const createdProduct = data?.createProduct;
    if (createdProduct?.id) {
      setId(createdProduct.id);
    }

    return createdProduct;
  }, [createProductMutation]);

  // Update product wrapper
  const updateProduct = useCallback(async (input: Omit<ProductUpdateInput, 'id'>) => {
    if (!id) throw new Error('Product ID is required for updates');

    const { data } = await updateProductMutation({
      variables: { 
        input: { ...input, id } 
      }
    });
    
    return data?.updateProduct;
  }, [id, updateProductMutation]);

  // Delete product wrapper
  const deleteProduct = useCallback(async () => {
    if (!id) throw new Error('Product ID is required for deletion');

    const { data } = await deleteProductMutation({
      variables: { id }
    });

    if (data?.deleteProduct) {
      setId(undefined);
    }
    
    return data?.deleteProduct;
  }, [id, deleteProductMutation]);

  return {
    // Data
    product: productData?.product as Product,
    
    // Loading states
    loading: loadingProduct,
    creating,
    updating,
    deleting,
    
    // Errors
    error: productError || createError || updateError || deleteError,
    
    // CRUD operations
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Refresh data
    refetch: refetchProduct,
  };
}
