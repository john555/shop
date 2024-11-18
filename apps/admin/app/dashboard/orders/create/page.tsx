'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  Hash,
  Plus,
  Search,
  Trash2,
  PencilIcon,
  User,
  MapPin,
} from 'lucide-react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const FormSchema = z.object({
  customerId: z.string(),
  products: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().min(1),
    })
  ),
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

type FormValues = z.infer<typeof FormSchema>;

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface SelectedProduct extends Product {
  quantity: number;
}

const customers: Customer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    address: '123 Main St, Anytown, AN 12345',
    phone: '+1 234-567-8901',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    address: '456 Elm St, Somewhere, SW 67890',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    address: '789 Oak St, Nowhere, NW 13579',
    phone: '+1 987-654-3210',
  },
];

const products: Product[] = [
  { id: '1', name: 'Wireless Earbuds', price: 79.99 },
  { id: '2', name: 'Smart Watch', price: 199.99 },
  { id: '3', name: 'Bluetooth Speaker', price: 59.99 },
];

export default function CreateOrderPage() {
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);
  const [selectedProducts, setSelectedProducts] = React.useState<
    SelectedProduct[]
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customerId: '',
      products: [],
      notes: '',
      tags: [],
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    // Here you would typically send the data to your API
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Create New Order
          </h2>
          <p className="text-sm text-muted-foreground">
            Add a new order to your store
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <Button type="submit" form="create-order-form">
            Create order
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          id="create-order-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <ProductsCard
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
              <PaymentCard selectedProducts={selectedProducts} />
            </div>
            <div className="space-y-6">
              <CustomerCard
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
              />
              <NotesCard form={form} />
              <TagsCard form={form} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface CustomerCardProps {
  selectedCustomer: Customer | null;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
}

function CustomerCard({
  selectedCustomer,
  setSelectedCustomer,
}: CustomerCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={selectedCustomer ? '/placeholder.svg' : ''}
                    alt=""
                  />
                  <AvatarFallback>
                    {selectedCustomer ? selectedCustomer.name.charAt(0) : '?'}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {selectedCustomer
                    ? selectedCustomer.name
                    : 'Select customer...'}
                </span>
              </div>
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search customers..." />
              <CommandEmpty>No customer found.</CommandEmpty>
              <CommandList>
                {customers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    onSelect={() => {
                      setSelectedCustomer(customer);
                      setOpen(false);
                    }}
                  >
                    {customer.name}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {customer.email}
                    </span>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Contact Information
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {selectedCustomer.email}
                </p>
                {selectedCustomer.phone && (
                  <p className="text-sm text-muted-foreground pl-6">
                    {selectedCustomer.phone}
                  </p>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {selectedCustomer.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProductsCardProps {
  selectedProducts: SelectedProduct[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<SelectedProduct[]>>;
}

function ProductsCard({
  selectedProducts,
  setSelectedProducts,
}: ProductsCardProps) {
  const [open, setOpen] = React.useState(false);

  const addProduct = (product: Product) => {
    setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    setOpen(false);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Add product
              <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search products..." />
              <CommandEmpty>No product found.</CommandEmpty>
              <CommandList>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    onSelect={() => addProduct(product)}
                  >
                    {product.name}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ${product.price}
                    </span>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="space-y-4">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex-1 space-y-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${product.price}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    updateQuantity(product.id, parseInt(e.target.value))
                  }
                  className="w-20"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentCardProps {
  selectedProducts: SelectedProduct[];
}

function PaymentCard({ selectedProducts }: PaymentCardProps) {
  const subtotal = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedProducts.map((product) => (
          <div key={product.id} className="flex justify-between text-sm">
            <span>
              {product.name} (x{product.quantity})
            </span>
            <span>${(product.price * product.quantity).toFixed(2)}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface NotesCardProps {
  form: ReturnType<typeof useForm<FormValues>>;
}

function NotesCard({ form }: NotesCardProps) {
  const [open, setOpen] = React.useState(false);
  const notes = form.watch('notes');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Notes</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto">
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Edit notes</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Order Notes</DialogTitle>
              <DialogDescription>
                Add or modify additional information for this order.
              </DialogDescription>
            </DialogHeader>
            <NotesModal form={form} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          {notes ? (
            notes
          ) : (
            <span className="text-muted-foreground">No notes added yet.</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface NotesModalProps {
  form: ReturnType<typeof useForm<FormValues>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function NotesModal({ form, setOpen }: NotesModalProps) {
  const { control } = form;

  return (
    <div className="grid gap-4 py-4">
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any additional notes here..."
                className="min-h-[200px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Use order notes to add important details about the order, such as
              special instructions, customer preferences, or any other relevant
              information that doesn&apos;t fit in other fields.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button type="button" onClick={() => setOpen(false)}>
          Save changes
        </Button>
      </DialogFooter>
    </div>
  );
}

interface TagsCardProps {
  form: ReturnType<typeof useForm<FormValues>>;
}

function TagsCard({ form }: TagsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col space-y-4">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="Enter a tag and press Enter"
                      className="pl-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          e.preventDefault();
                          const newTag = e.currentTarget.value.trim();
                          if (!field.value.includes(newTag)) {
                            field.onChange([...field.value, newTag]);
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-xs"
                          onClick={() => {
                            const newValue = field.value.filter(
                              (_, i) => i !== index
                            );
                            field.onChange(newValue);
                          }}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Add relevant tags to categorize this order. Press Enter after
                each tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
