'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Banknote, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { formatCurrency } from '../../(shopping)/utils/currency';
import { DiscountInput } from '../../(shopping)/components/discount-input';
import { createStoreFrontUrl } from '@/lib/common/url';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  media: { url: string }[];
}

interface Discount {
  type: 'giftcard' | 'promocode';
  code: string;
  amount: number;
}

interface SavedOption {
  id: string;
  label: string;
  details: Record<string, string>;
}

const steps = ['Contact', 'Shipping', 'Payment'];

export default function CheckoutPage({
  params,
}: {
  params: { shopSlug: string };
}) {
  const router = useRouter();
  const shopSlug = params.shopSlug as string;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    fullName: '',
    address: '',
    city: '',
    region: '',
    country: '',
    postalCode: '',
    deliveryNotes: '',
    paymentMethod: 'cash-on-delivery',
  });
  const [savedOptions, setSavedOptions] = useState<SavedOption[]>([]);
  //const [saveCurrentDetails, setSaveCurrentDetails] = useState(false) //Removed

  useEffect(() => {
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        title: 'Eco-Friendly Water Bottle',
        price: 24.99,
        media: [
          {
            url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=300&q=80',
          },
        ],
        quantity: 2,
      },
      {
        id: '2',
        title: 'Recycled Paper Notebook',
        price: 12.5,
        media: [
          {
            url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=300&q=80',
          },
        ],
        quantity: 1,
      },
    ];
    setCartItems(mockCartItems);

    // Load saved options from localStorage
    const storedOptions = localStorage.getItem('savedCheckoutOptions');
    if (storedOptions) {
      setSavedOptions(JSON.parse(storedOptions));
    }

    const savedPhone = localStorage.getItem('savedPhone');
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedPhone) setFormData((prev) => ({ ...prev, phone: savedPhone }));
    if (savedEmail) setFormData((prev) => ({ ...prev, email: savedEmail }));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('savedPhone', formData.phone);
    localStorage.setItem('savedEmail', formData.email);
    console.log('Order submitted:', { formData, cartItems, discounts });
    router.push(createStoreFrontUrl(shopSlug, '/order-processing'));
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalDiscount = () => {
    return discounts.reduce((total, discount) => total + discount.amount, 0);
  };

  const getShippingCost = () => {
    return 10;
  };

  const getTax = () => {
    return (getSubtotal() - getTotalDiscount()) * 0.1;
  };

  const getTotalPrice = () => {
    return getSubtotal() - getTotalDiscount() + getShippingCost() + getTax();
  };

  const applyDiscount = async (code: string) => {
    return new Promise<{
      success: boolean;
      message: string;
      discount?: number;
    }>((resolve) => {
      setTimeout(() => {
        if (code === 'DISCOUNT10') {
          const discountAmount = getSubtotal() * 0.1;
          setDiscounts((prev) => [
            ...prev,
            { type: 'promocode', code, amount: discountAmount },
          ]);
          resolve({
            success: true,
            message: '10% discount applied successfully!',
            discount: discountAmount,
          });
        } else if (code === 'GIFT50') {
          const discountAmount = 50;
          setDiscounts((prev) => [
            ...prev,
            { type: 'giftcard', code, amount: discountAmount },
          ]);
          resolve({
            success: true,
            message: '$50 gift card applied successfully!',
            discount: discountAmount,
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid code. Please try again.',
          });
        }
      }, 1000);
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  //const handleSavedOptionSelect = (option: SavedOption) => { //Removed
  //  setFormData(option.details)
  //} //Removed

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City/Town</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region/Province</Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code (if applicable)</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryNotes">Delivery Notes (optional)</Label>
              <textarea
                id="deliveryNotes"
                name="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={handleInputChange}
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add any special instructions for delivery here"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, paymentMethod: value }))
            }
            className="grid gap-4 sm:grid-cols-2"
          >
            <Label
              htmlFor="cash-on-delivery"
              className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${
                formData.paymentMethod === 'cash-on-delivery'
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-primary/50'
              }`}
            >
              <RadioGroupItem
                value="cash-on-delivery"
                id="cash-on-delivery"
                className="sr-only"
              />
              <div
                className={`rounded-full p-2 ${
                  formData.paymentMethod === 'cash-on-delivery'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <Banknote className="h-6 w-6" />
              </div>
              <div className="flex-grow">
                <div className="font-semibold">Cash on Delivery</div>
                <div className="text-sm text-muted-foreground">
                  Pay when you receive
                </div>
              </div>
            </Label>
            <Label
              htmlFor="mpesa"
              className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${
                formData.paymentMethod === 'mpesa'
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="mpesa" id="mpesa" className="sr-only" />
              <div
                className={`rounded-full p-2 ${
                  formData.paymentMethod === 'mpesa'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="flex-grow">
                <div className="font-semibold">M-Pesa</div>
                <div className="text-sm text-muted-foreground">
                  Pay via mobile money
                </div>
              </div>
            </Label>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 pt-24">
      <Link
        href={createStoreFrontUrl(shopSlug, '/cart')}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Link>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {steps.map((step, index) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          index === currentStep
                            ? 'bg-primary'
                            : index < currentStep
                            ? 'bg-primary/50'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-normal text-muted-foreground">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">
                {steps[currentStep]}
              </h2>
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
                <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={
                      currentStep === steps.length - 1 ? handleSubmit : nextStep
                    }
                    className="w-full sm:w-auto"
                  >
                    {currentStep === steps.length - 1 ? 'Place Order' : 'Next'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <Card className="shadow-md mb-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 relative">
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
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(getSubtotal())}</span>
                    </div>
                    {discounts.map((discount, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-green-600"
                      >
                        <span>
                          {discount.type === 'giftcard'
                            ? 'Gift Card'
                            : 'Promo Code'}
                        </span>
                        <span>-{formatCurrency(discount.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatCurrency(getShippingCost())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatCurrency(getTax())}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Discount</CardTitle>
              </CardHeader>
              <CardContent>
                <DiscountInput onApply={applyDiscount} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
