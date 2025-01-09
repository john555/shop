import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

// GraphQL Operations
const GET_CART = gql`
  query GetCart($id: ID!) {
    cart(id: $id) {
      id
      status
      subtotalAmount
      taxAmount
      shippingAmount
      discountAmount
      totalAmount
      currency
      currencySymbol
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
      discounts {
        id
        code
        type
        amount
        applied
      }
    }
  }
`;

const CREATE_CART = gql`
  mutation CreateCart($input: CreateCartInput!) {
    createCart(input: $input) {
      id
    }
  }
`;

const ADD_CART_ITEM = gql`
  mutation AddCartItem($input: AddCartItemInput!) {
    addCartItem(input: $input) {
      id
    }
  }
`;

const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      id
    }
  }
`;

const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($id: ID!) {
    removeCartItem(id: $id)
  }
`;

const APPLY_DISCOUNT = gql`
  mutation ApplyDiscount($input: ApplyDiscountInput!) {
    applyDiscount(input: $input) {
      id
      discountAmount
      totalAmount
    }
  }
`;

// Types
type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  variantName?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
};

type CartDiscount = {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  amount: number;
  applied: boolean;
};

type Cart = {
  id: string;
  status: 'ACTIVE' | 'CHECKOUT_STARTED' | 'CONVERTED' | 'ABANDONED' | 'EXPIRED';
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  currencySymbol: string;
  items: CartItem[];
  discounts: CartDiscount[];
};

type UseCartOptions = {
  storeId: string;
  onError?: (error: Error) => void;
  initialCartId?: string;
};

const useCart = ({ storeId, onError, initialCartId }: UseCartOptions) => {
  const [cartId, setCartId] = useState<string | null>(initialCartId || null);

  // Fetch cart data
  const {
    data,
    loading: loadingCart,
    refetch,
  } = useQuery(GET_CART, {
    variables: { id: cartId },
    skip: !cartId,
    onError: (error) => onError?.(error),
  });

  // Create cart mutation
  const [createCartMutation] = useMutation(CREATE_CART, {
    onError: (error) => onError?.(error),
  });

  // Add item mutation
  const [addItemMutation] = useMutation(ADD_CART_ITEM, {
    onError: (error) => onError?.(error),
    onCompleted: () => refetch(),
  });

  // Update item mutation
  const [updateItemMutation] = useMutation(UPDATE_CART_ITEM, {
    onError: (error) => onError?.(error),
    onCompleted: () => refetch(),
  });

  // Remove item mutation
  const [removeItemMutation] = useMutation(REMOVE_CART_ITEM, {
    onError: (error) => onError?.(error),
    onCompleted: () => refetch(),
  });

  // Apply discount mutation
  const [applyDiscountMutation] = useMutation(APPLY_DISCOUNT, {
    onError: (error) => onError?.(error),
    onCompleted: () => refetch(),
  });

  // Initialize cart
  const initializeCart = useCallback(async () => {
    if (!cartId) {
      try {
        const result = await createCartMutation({
          variables: {
            input: {
              storeId,
            },
          },
        });
        setCartId(result.data.createCart.id);
      } catch (error) {
        onError?.(error as Error);
      }
    }
  }, [cartId, createCartMutation, storeId, onError]);

  // Add item to cart
  const addItem = useCallback(
    async (productId: string, quantity: number, variantId?: string) => {
      if (!cartId) {
        await initializeCart();
      }
      return addItemMutation({
        variables: {
          input: {
            cartId,
            productId,
            variantId,
            quantity,
          },
        },
      });
    },
    [cartId, addItemMutation, initializeCart]
  );

  // Update item quantity
  const updateItemQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      return updateItemMutation({
        variables: {
          input: {
            cartItemId,
            quantity,
          },
        },
      });
    },
    [updateItemMutation]
  );

  // Remove item from cart
  const removeItem = useCallback(
    (itemId: string) => {
      return removeItemMutation({
        variables: { id: itemId },
      });
    },
    [removeItemMutation]
  );

  // Apply discount code
  const applyDiscount = useCallback(
    (code: string) => {
      if (!cartId) return;
      return applyDiscountMutation({
        variables: {
          input: {
            cartId,
            code,
          },
        },
      });
    },
    [cartId, applyDiscountMutation]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    setCartId(null);
  }, []);

  // Initialize cart on mount if needed
  useEffect(() => {
    if (!cartId) {
      initializeCart();
    }
  }, [cartId, initializeCart]);

  return {
    cart: data?.cart as Cart | null,
    loading: loadingCart,
    cartId,
    addItem,
    updateItemQuantity,
    removeItem,
    applyDiscount,
    clearCart,
    refetchCart: refetch,
  };
};

export default useCart;

// Example usage:
/*
const CartComponent = () => {
  const { 
    cart, 
    loading, 
    addItem, 
    updateItemQuantity, 
    removeItem, 
    applyDiscount 
  } = useCart({
    storeId: 'store-123',
    onError: (error) => console.error(error),
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Cart ({cart?.items.length} items)</h2>
      <div>
        {cart?.items.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: {cart.currencySymbol}{item.totalAmount}</p>
            <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
              +
            </button>
            <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
              -
            </button>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div>
        <p>Subtotal: {cart?.currencySymbol}{cart?.subtotalAmount}</p>
        <p>Total: {cart?.currencySymbol}{cart?.totalAmount}</p>
      </div>
    </div>
  );
};
*/
