'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MediaType, Product } from '../types';
import { formatCurrency } from '../utils/currency';
import { createStoreFrontUrl } from '@/lib/common/url';

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage({ params }: { params: { shopSlug: string } }) {
  const shopSlug = params.shopSlug as string;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    // In a real application, we would fetch the cart items from an API or local storage
    const mockCartItems = [
      {
        id: '1',
        title: 'Product 1',
        price: 10.99,
        media: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=300&q=80',
            type: MediaType.IMAGE,
          },
        ],
        quantity: 1,
      },
      {
        id: '2',
        title: 'Product 2',
        price: 25.5,
        media: [
          {
            id: '2',
            url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=300&q=80',
            type: MediaType.IMAGE,
          },
        ],
        quantity: 2,
      },
    ] as CartItem[];
    setCartItems(mockCartItems);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    router.push(createStoreFrontUrl(shopSlug, '/checkout'));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl mb-4">Your cart is empty</p>
              <Link href="/products" className="text-primary hover:underline">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 border-b pb-4"
                >
                  <div className="flex-shrink-0 w-24 h-24 relative">
                    <Image
                      src={item.media[0]?.url || '/placeholder.svg'}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price || 0)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                      className="w-16 text-center"
                      min="0"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Cart Total:</span>
                <span className="text-xl font-bold">
                  {formatCurrency(getCartTotal())}
                </span>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCheckout} className="w-full md:w-auto">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
