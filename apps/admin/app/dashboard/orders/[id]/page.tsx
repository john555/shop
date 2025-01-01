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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Customer,
  Order,
  OrderStatus,
  OrderUpdateInput,
  PaymentStatus,
  ShipmentStatus,
} from '@/types/admin-api';
import { useOrder } from '@/admin/hooks/order';
import { useParams } from 'next/navigation';
import { useStore } from '@/admin/hooks/store';
import { formatPrice } from '@/common/currency';
import { OrderStatusBadge } from '../(components)/(ui)/order-status-badge';
import { OrderShipmentStatusBadge } from '../(components)/(ui)/order-shipment-status-badge';
import { OrderPaymentStatusBadge } from '../(components)/(ui)/order-payment-status-badge';
import { CancelledOrderBanner } from '../(components)/(ui)/cancelled-order-banner';

const generateTimeline = (order: Order) => {
  const timeline = [
    {
      id: 1,
      title: 'Order Placed',
      description: 'Order has been placed successfully',
      date: order.createdAt,
      icon: CreditCard,
      completed: true,
    },
    {
      id: 2,
      title: 'Payment Received',
      description: 'Payment for Order has been successfully processed',
      date: order.paidAt ? order.paidAt : 'Pending',
      icon: CreditCard,
      completed: order.paymentStatus === PaymentStatus.Completed,
    },
    {
      id: 3,
      title: 'Order Processed',
      description:
        'Order has been processed and is being prepared for shipment',
      date:
        order.shipmentStatus !== ShipmentStatus.Pending
          ? order.updatedAt
          : 'Pending',
      icon: Package,
      completed: order.shipmentStatus !== ShipmentStatus.Pending,
    },
    {
      id: 4,
      title: 'Order Shipped',
      description: 'Order has been shipped and is on its way',
      date: order.shippedAt ? order.shippedAt : 'Pending',
      icon: Truck,
      completed:
        order.shipmentStatus === ShipmentStatus.Shipped ||
        order.shipmentStatus === ShipmentStatus.Delivered,
    },
    {
      id: 5,
      title: 'Delivered',
      description: 'Order has been delivered',
      date: order.deliveredAt ? order.deliveredAt : 'Pending',
      icon: CheckCircle,
      completed: order.shipmentStatus === ShipmentStatus.Delivered,
    },
  ];

  return timeline;
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const {
    order,
    loading: loadingOrder,
    updateOrder,
  } = useOrder({
    id: id.toString(),
  });
  const loading = loadingOrder;

  const handleUpdatePaymentStatus = async (newStatus: PaymentStatus) => {
    if (!order) return;

    try {
      await updateOrder({
        paymentStatus: newStatus,
      });
      toast({
        title: 'Payment Status Updated',
        description: `The payment status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateShipmentStatus = async (newStatus: ShipmentStatus) => {
    if (!order) return;

    try {
      await updateOrder({
        shipmentStatus: newStatus,
      });
      toast({
        title: 'Shipment Status Updated',
        description: `The shipment status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update shipment status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!order && loading) return null;

  return order ? (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Order Details
          </h2>
          <p className="text-sm text-muted-foreground">
            View details for order {order.formattedOrderNumber}
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
      {order.status === OrderStatus.Cancelled && (
        <CancelledOrderBanner
          orderNumber={order.formattedOrderNumber}
          cancelDate={order.cancelledAt}
        />
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <OrderItemsCard
            order={order}
            onUpdateShipmentStatus={handleUpdateShipmentStatus}
            updateOrder={updateOrder}
          />
          <TimelineCard timeline={generateTimeline(order)} />
        </div>
        <div className="space-y-6">
          <CustomerCard
            customer={order.customer ?? undefined}
            notes={order.customerNotes ?? undefined}
          />
          <PaymentDetailsCard
            status={order.paymentStatus}
            disabled={order.status === OrderStatus.Cancelled}
            formattedTotal={order.formattedTotalAmount}
            paidAt={order.paidAt}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
          />
          <ShippingDetailsCard
            status={order.shipmentStatus}
            trackingNumber={order.trackingNumber ?? undefined}
            trackingUrl={order.trackingUrl ?? undefined}
            shippedAt={order.shippedAt}
            deliveredAt={order.deliveredAt}
          />
        </div>
      </div>
    </div>
  ) : null;
}

interface OrderItemsCardProps {
  order: Order;
  updateOrder: (input: Omit<OrderUpdateInput, 'id'>) => Promise<Order>;
  onUpdateShipmentStatus: (status: ShipmentStatus) => void;
}

const OrderItemsCard: React.FC<OrderItemsCardProps> = ({
  order,
  updateOrder,
  onUpdateShipmentStatus,
}) => {
  const { store } = useStore();
  const handlePrintInvoice = React.useCallback(() => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice for Order ${order.formattedOrderNumber}</title>
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
          <h2>${store?.name || 'Your Store Name'}</h2>
          <p>123 Store Street, City, State, ZIP</p>
          <p>Phone: ${store?.phone || '(123) 456-7890'}</p>
          <p>Email: ${store?.email || 'contact@yourstore.com'}</p>
        </div>
        <h1>Invoice <span style="float: right;">Order ${
          order.formattedOrderNumber
        }</span></h1>
        <p><strong>Customer:</strong> ${order.customer?.firstName} ${
      order.customer?.lastName
    }</p>
        <p><strong>Date:</strong> ${order.createdAt}</p>
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
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>${item.title} (${item.variantName})</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.unitPrice, store)}</td>
                <td>${formatPrice(item.totalAmount, store)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Subtotal: ${formatPrice(order.subtotalAmount, store)}</p>
          <p>Tax: ${formatPrice(order.taxAmount, store)}</p>
          <p>Shipping: ${formatPrice(order.shippingAmount, store)}</p>
          <p>Discount: ${formatPrice(order.discountAmount, store)}</p>
          <p>Total: ${formatPrice(order.totalAmount, store)}</p>
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
  }, [order, store]);

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
                    the order.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() =>
                      updateOrder({ status: OrderStatus.Cancelled })
                    }
                  >
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
          {order.items.map((item) => (
            <li
              key={item.id}
              className="py-2 flex justify-between items-center text-sm"
            >
              <div className="flex items-center space-x-2">
                <p className="font-medium">
                  {item.title}{' '}
                  {item.variantName !== 'Default'
                    ? `(${item.variantName})`
                    : ''}
                </p>
                <p className="text-muted-foreground">x{item.quantity}</p>
              </div>
              <p className="font-medium">
                {formatPrice(item.totalAmount, store)}
              </p>
            </li>
          ))}
        </ul>
        <Separator className="my-2" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{formatPrice(order.subtotalAmount, store)}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>{formatPrice(order.taxAmount, store)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>{formatPrice(order.shippingAmount, store)}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount</p>
            <p>{formatPrice(order.discountAmount, store)}</p>
          </div>
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>{formatPrice(order.totalAmount, store)}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex justify-between items-center text-sm">
            <p>Order Status:</p>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>Payment Status:</p>
            <OrderPaymentStatusBadge status={order.paymentStatus} />
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>Shipment Status:</p>
            <OrderShipmentStatusBadge status={order.shipmentStatus} />
          </div>
          {order.paymentStatus === PaymentStatus.Completed &&
            order.shipmentStatus !== ShipmentStatus.Delivered && (
              <Button
                onClick={() => {
                  const nextStatus =
                    order.shipmentStatus === ShipmentStatus.Pending
                      ? ShipmentStatus.Processing
                      : order.shipmentStatus === ShipmentStatus.Processing
                      ? ShipmentStatus.Shipped
                      : order.shipmentStatus === ShipmentStatus.Shipped
                      ? ShipmentStatus.Delivered
                      : null;
                  if (nextStatus) onUpdateShipmentStatus(nextStatus);
                }}
                className="self-end mt-2"
                size="sm"
              >
                <Truck className="mr-2 h-4 w-4" />
                {order.shipmentStatus === ShipmentStatus.Pending
                  ? 'Process'
                  : order.shipmentStatus === ShipmentStatus.Processing
                  ? 'Ship'
                  : order.shipmentStatus === ShipmentStatus.Shipped
                  ? 'Mark as Delivered'
                  : 'Update Status'}
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

interface TimelineCardProps {
  timeline: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    icon: React.ElementType;
    completed: boolean;
  }>;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ timeline }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
        <CardDescription>Track Order status</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          {timeline.map((step, index) => (
            <li
              key={step.id}
              className={`ml-6 ${index !== timeline.length - 1 ? 'mb-10' : ''}`}
            >
              <span
                className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ${
                  step.completed
                    ? 'bg-green-500 ring-green-100 dark:bg-green-900 dark:ring-green-900/20'
                    : 'bg-gray-100 ring-white dark:bg-gray-700 dark:ring-gray-900'
                }`}
              >
                {step.icon && (
                  <step.icon
                    className={`w-5 h-5 ${
                      step.completed
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                )}
              </span>
              <h3
                className={`flex items-center mb-1 text-lg font-semibold ${
                  step.completed
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {step.title}
                {step.completed && (
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
  customer?: Customer;
  notes?: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, notes }) => {
  if (!customer) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={undefined}
              alt={`${customer.firstName} ${customer.lastName}`}
            />
            <AvatarFallback>
              {customer.firstName?.[0]}
              {customer.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {customer.firstName} {customer.lastName}
            </p>
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
          {customer.phoneNumber && (
            <p className="text-sm text-muted-foreground">
              {customer.phoneNumber}
            </p>
          )}
        </div>
        {notes && (
          <>
            <Separator />
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="font-medium">Customer Notes</span>
              </div>
              <p className="text-sm text-muted-foreground">{notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

interface PaymentDetailsCardProps {
  disabled: boolean;
  status: PaymentStatus;
  formattedTotal: string;
  paidAt?: string;
  onUpdatePaymentStatus: (status: PaymentStatus) => void;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  status,
  disabled,
  formattedTotal,
  paidAt,
  onUpdatePaymentStatus,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status</span>
          <OrderPaymentStatusBadge status={status} />
        </div>
        <Separator />
        <div className="flex justify-between items-center font-semibold">
          <span>Total Amount</span>
          <span>{formattedTotal}</span>
        </div>
        {paidAt && (
          <p className="text-sm text-muted-foreground text-center">
            Paid on: {paidAt}
          </p>
        )}
        <div className="flex justify-end space-x-2">
          {status !== PaymentStatus.Completed && (
            <Button
              disabled={disabled}
              onClick={() => onUpdatePaymentStatus(PaymentStatus.Completed)}
              className="text-sm"
            >
              Mark as Paid
            </Button>
          )}
          {status === PaymentStatus.Completed && (
            <Button
              onClick={() => onUpdatePaymentStatus(PaymentStatus.Pending)}
              variant="outline"
              className="text-sm"
            >
              Mark as Pending
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ShippingDetailsCardProps {
  status: ShipmentStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

const ShippingDetailsCard: React.FC<ShippingDetailsCardProps> = ({
  status,
  trackingNumber,
  trackingUrl,
  shippedAt,
  deliveredAt,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status</span>
          <OrderShipmentStatusBadge status={status} />
        </div>
        {(trackingNumber || shippedAt || deliveredAt) && <Separator />}
        {trackingNumber && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Tracking Number</p>
            <p className="text-sm text-muted-foreground">{trackingNumber}</p>
            {trackingUrl && (
              <Button variant="link" className="p-0" asChild>
                <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                  Track Package
                </a>
              </Button>
            )}
          </div>
        )}
        {shippedAt && (
          <p className="text-sm text-muted-foreground">
            Shipped on: {shippedAt}
          </p>
        )}
        {deliveredAt && (
          <p className="text-sm text-muted-foreground">
            Delivered on: {deliveredAt}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
