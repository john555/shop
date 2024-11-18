'use client';

import React from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Printer,
  MoreHorizontal,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

// Type definitions
enum OrderStatus {
  InTransit = 'In Transit',
  // Add other order statuses as needed
}

enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
}

enum FulfillmentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Fulfilled = 'Fulfilled',
  Cancelled = 'Cancelled',
}

enum DeliveryStatus {
  NotShipped = 'Not Shipped',
  Shipped = 'Shipped',
  OutForDelivery = 'Out for Delivery',
  Delivered = 'Delivered',
}

interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  lastFourDigits: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
    address: string;
  };
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  timeline: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    icon: React.ElementType;
    completed: boolean;
  }>;
  fulfillmentStatus: FulfillmentStatus;
  deliveryStatus: DeliveryStatus;
}

// Mock data for the order
const orderData: Order = {
  id: 'ORD-12345',
  status: OrderStatus.InTransit,
  paymentStatus: PaymentStatus.Pending,
  paymentMethod: 'Credit Card',
  lastFourDigits: '4242',
  customer: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    address: '123 Main St, Anytown, AN 12345',
  },
  items: [
    { id: 1, name: 'Wireless Earbuds', quantity: 1, price: 79.99 },
    { id: 2, name: 'Smart Watch', quantity: 1, price: 199.99 },
  ],
  total: 279.98,
  timeline: [
    {
      id: 1,
      title: 'Order Placed',
      description: 'Your order has been placed successfully',
      date: '2023-06-01',
      icon: CreditCard,
      completed: true,
    },
    {
      id: 2,
      title: 'Payment Received',
      description: 'Payment for your order has been successfully processed',
      date: '2023-06-01',
      icon: CreditCard,
      completed: false,
    },
    {
      id: 3,
      title: 'Order Processed',
      description:
        'Your order has been processed and is being prepared for shipment',
      date: '2023-06-02',
      icon: Package,
      completed: false,
    },
    {
      id: 4,
      title: 'Order Shipped',
      description: 'Your order has been shipped and is on its way',
      date: '2023-06-03',
      icon: Truck,
      completed: false,
    },
    {
      id: 5,
      title: 'Out for Delivery',
      description: 'Your order is out for delivery',
      date: '2023-06-04',
      icon: Truck,
      completed: false,
    },
    {
      id: 6,
      title: 'Delivered',
      description: 'Your order has been delivered',
      date: 'Estimated: 2023-06-05',
      icon: CheckCircle,
      completed: false,
    },
  ],
  fulfillmentStatus: FulfillmentStatus.Pending,
  deliveryStatus: DeliveryStatus.NotShipped,
};

export default function OrderDetailsPage() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>(
    orderData.paymentStatus
  );
  const [fulfillmentStatus, setFulfillmentStatus] =
    React.useState<FulfillmentStatus>(orderData.fulfillmentStatus);
  const [deliveryStatus, setDeliveryStatus] = React.useState<DeliveryStatus>(
    orderData.deliveryStatus
  );
  const [timeline, setTimeline] = React.useState(orderData.timeline);

  const handleConfirmPayment = React.useCallback(() => {
    setPaymentStatus(PaymentStatus.Paid);
    setActiveStep(2);
    updateTimeline(2);
    toast({
      title: 'Payment Confirmed',
      description: 'The payment for this order has been confirmed.',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeliveryStatusChange = React.useCallback(
    (newStatus: DeliveryStatus) => {
      setDeliveryStatus(newStatus);
      let step = 3;
      switch (newStatus) {
        case DeliveryStatus.Shipped:
          step = 4;
          break;
        case DeliveryStatus.OutForDelivery:
          step = 5;
          break;
        case DeliveryStatus.Delivered:
          step = 6;
          setFulfillmentStatus(FulfillmentStatus.Fulfilled);
          break;
        default:
          step = 3;
      }
      setActiveStep(step);
      updateTimeline(step);
      toast({
        title: 'Delivery Status Updated',
        description: `The delivery status has been updated to ${newStatus}.`,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const updateTimeline = React.useCallback((step: number) => {
    setTimeline((prevTimeline) =>
      prevTimeline.map((item, index) => {
        if (index < step) {
          return { ...item, completed: true };
        }
        return item;
      })
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Order Details
          </h2>
          <p className="text-sm text-muted-foreground">
            View details for order {orderData.id}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
      <Separator />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <OrderItemsCard
            items={orderData.items}
            total={orderData.total}
            paymentStatus={paymentStatus}
            fulfillmentStatus={fulfillmentStatus}
            deliveryStatus={deliveryStatus}
            onUpdateDeliveryStatus={handleDeliveryStatusChange}
          />
          <TimelineCard timeline={timeline} activeStep={activeStep} />
        </div>
        <div className="space-y-6">
          <PaymentDetailsCard
            paymentStatus={paymentStatus}
            paymentMethod={orderData.paymentMethod}
            lastFourDigits={orderData.lastFourDigits}
            total={orderData.total}
            onConfirmPayment={handleConfirmPayment}
          />
          <CustomerCard customer={orderData.customer} />
        </div>
      </div>
    </div>
  );
}

interface OrderItemsCardProps {
  items: Array<{ id: number; name: string; quantity: number; price: number }>;
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  deliveryStatus: DeliveryStatus;
  onUpdateDeliveryStatus: (status: DeliveryStatus) => void;
}

const OrderItemsCard: React.FC<OrderItemsCardProps> = ({
  items,
  total,
  paymentStatus,
  fulfillmentStatus,
  deliveryStatus,
  onUpdateDeliveryStatus,
}) => {
  const taxRate = 0.1; // 10% tax rate
  const subtotal = total;
  const tax = subtotal * taxRate;
  const totalWithTax = subtotal + tax;

  const getNextDeliveryStatus = React.useCallback(
    (currentStatus: DeliveryStatus): DeliveryStatus | null => {
      const statuses = [
        DeliveryStatus.NotShipped,
        DeliveryStatus.Shipped,
        DeliveryStatus.OutForDelivery,
        DeliveryStatus.Delivered,
      ];
      const currentIndex = statuses.indexOf(currentStatus);
      return currentIndex < statuses.length - 1
        ? statuses[currentIndex + 1]
        : null;
    },
    []
  );

  const handlePrintInvoice = React.useCallback(() => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice for Order ${orderData.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .total {
            font-weight: bold;
            font-size: 1.2em;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #777;
          }
          .store-details {
            margin-bottom: 20px;
            text-align: right;
          }
          .store-details h2 {
            color: #3498db;
            margin-bottom: 5px;
          }
          .store-details p {
            margin: 0;
            font-size: 0.9em;
          }
          .store-logo {
            max-width: 200px;
            max-height: 100px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="store-details">
          <img src="/placeholder.svg?height=100&width=200" alt="Store Logo" class="store-logo">
          <h2>Your Store Name</h2>
          <p>123 Store Street, City, State, ZIP</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: contact@yourstore.com</p>
        </div>
        <h1>Invoice <span style="float: right;">Order ${
          orderData.id
        }</span></h1>
        <p><strong>Customer:</strong> ${orderData.customer.name}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
          <p>Tax (10%): $${tax.toFixed(2)}</p>
          <p>Total: $${totalWithTax.toFixed(2)}</p>
        </div>
        <div class="footer">
          Thank you for your business!
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open print window');
    }
  }, [items, subtotal, tax, totalWithTax]);

  return (
    <Card>
      <CardHeader className="pb-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Order Items</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handlePrintInvoice}>
              <Printer className="mr-2 h-4 w-4" />
              Print Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel Order
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to cancel this order?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently cancel
                    the order and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Yes, cancel order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item) => (
            <li
              key={item.id}
              className="py-2 flex justify-between items-center text-sm"
            >
              <div className="flex items-center space-x-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">x{item.quantity}</p>
              </div>
              <p className="font-medium">${item.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <Separator className="my-2" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax (10%)</p>
            <p>${tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>${totalWithTax.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex justify-between items-center text-sm">
            <p>Payment Status:</p>
            <Badge
              variant={
                paymentStatus === PaymentStatus.Paid
                  ? 'secondary'
                  : paymentStatus === PaymentStatus.Pending
                  ? 'outline'
                  : paymentStatus === PaymentStatus.Failed
                  ? 'destructive'
                  : 'default'
              }
              className="text-sm"
            >
              {paymentStatus}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>Fulfillment Status:</p>
            <Badge
              variant={
                fulfillmentStatus === FulfillmentStatus.Fulfilled
                  ? 'secondary'
                  : fulfillmentStatus === FulfillmentStatus.Processing
                  ? 'outline'
                  : fulfillmentStatus === FulfillmentStatus.Cancelled
                  ? 'destructive'
                  : 'default'
              }
              className="text-sm"
            >
              {fulfillmentStatus}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>Delivery Status:</p>
            <Badge
              variant={
                deliveryStatus === DeliveryStatus.Delivered
                  ? 'secondary'
                  : deliveryStatus === DeliveryStatus.OutForDelivery
                  ? 'outline'
                  : deliveryStatus === DeliveryStatus.Shipped
                  ? 'secondary'
                  : deliveryStatus === DeliveryStatus.NotShipped
                  ? 'outline'
                  : 'default'
              }
              className="text-sm"
            >
              {deliveryStatus}
            </Badge>
          </div>
          {paymentStatus === PaymentStatus.Paid &&
            deliveryStatus !== DeliveryStatus.Delivered && (
              <Button
                onClick={() => {
                  const nextStatus = getNextDeliveryStatus(deliveryStatus);
                  if (nextStatus) onUpdateDeliveryStatus(nextStatus);
                }}
                className="self-end mt-2"
                size="sm"
              >
                <Truck className="mr-2 h-4 w-4" />
                {getNextDeliveryStatus(deliveryStatus)}
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

interface TimelineItem {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: React.ElementType;
  completed: boolean;
}

interface TimelineCardProps {
  timeline: TimelineItem[];
  activeStep: number;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  timeline,
  activeStep,
}) => {
  const reversedTimeline = React.useMemo(
    () => [...timeline].reverse(),
    [timeline]
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
        <CardDescription>Track your order status</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          {reversedTimeline.map((step, index) => (
            <li
              key={step.id}
              className={`ml-6 ${
                index !== reversedTimeline.length - 1 ? 'mb-10' : ''
              }`}
            >
              <span
                className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ${
                  reversedTimeline.length - 1 - index < activeStep
                    ? 'bg-green-500 ring-green-100 dark:bg-green-900 dark:ring-green-900/20'
                    : reversedTimeline.length - 1 - index === activeStep
                    ? 'bg-primary ring-primary/20'
                    : 'bg-gray-100 ring-white dark:bg-gray-700 dark:ring-gray-900'
                }`}
              >
                {step.icon && (
                  <step.icon
                    className={`w-5 h-5 ${
                      reversedTimeline.length - 1 - index <= activeStep
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                )}
              </span>
              <h3
                className={`flex items-center mb-1 text-lg font-semibold ${
                  reversedTimeline.length - 1 - index <= activeStep
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {step.title}
                {reversedTimeline.length - 1 - index < activeStep && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3">
                    Completed
                  </span>
                )}
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {step.date}
              </time>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

interface CustomerCardProps {
  customer: {
    name: string;
    email: string;
    avatar: string;
    address: string;
  };
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4" />
            <span className="font-medium">Contact Information</span>
          </div>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="font-medium">Shipping Address</span>
          </div>
          <p className="text-sm text-muted-foreground">{customer.address}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface PaymentDetailsCardProps {
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  lastFourDigits: string;
  total: number;
  onConfirmPayment: () => void;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  paymentStatus,
  paymentMethod,
  lastFourDigits,
  total,
  onConfirmPayment,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status</span>
          <Badge
            variant={
              paymentStatus === PaymentStatus.Paid
                ? 'secondary'
                : paymentStatus === PaymentStatus.Pending
                ? 'outline'
                : paymentStatus === PaymentStatus.Failed
                ? 'destructive'
                : 'default'
            }
            className="text-sm"
          >
            {paymentStatus}
          </Badge>
        </div>
        <Separator />
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Payment Method</span>
            <span>{paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Card Number</span>
            <span>**** **** **** {lastFourDigits}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-center font-semibold">
          <span>Total Amount</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {paymentStatus === PaymentStatus.Pending && (
          <Button onClick={onConfirmPayment} className="w-full mt-4">
            <DollarSign className="mr-2 h-4 w-4" />
            Confirm Payment
          </Button>
        )}
        <p className="text-sm text-muted-foreground text-center">
          Last updated: {new Date().toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};
