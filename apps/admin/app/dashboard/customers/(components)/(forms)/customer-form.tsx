'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail, Phone, Globe, Hash, MapPin } from 'lucide-react';
import Link from 'next/link';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useParams, useRouter } from 'next/navigation';
import { useCustomer } from '@/admin/hooks/customer';
import { useStore } from '@/admin/hooks/store';
import {
  COUNTRIES,
  DASHBOARD_PAGE_LINK,
  getCountryFromPhoneCode,
  LANGUAGES,
} from '@/common/constants';
import { AddressOwnerType, AddressType, Customer, Language } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { AddressDialog } from '@/components/address-dialog';

const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  language: z.nativeEnum(Language).default(Language.En),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .object({
      nationalNumber: z.string().optional(),
      countryCallingCode: z.string().optional(),
    })
    .optional(),
  marketingEmails: z.boolean().default(false),
  marketingSMS: z.boolean().default(false),
  notes: z.string().optional(),
  tagIds: z.array(z.string()),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CustomerForm() {
  const { id } = useParams();
  const router = useRouter();
  const { store } = useStore();
  const {
    customer,
    createCustomer,
    updateCustomer,
    creating,
    updating,
    refetchCustomer,
  } = useCustomer({
    id: id?.toString(),
    storeId: store?.id,
  });

  const isEditMode = !!id;

  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: getInitialValues(customer),
  });

  const { isDirty, isValid } = form.formState;

  function getInitialValues(customer?: Customer) {
    let nationalNumber = '';
    let countryCallingCode = COUNTRIES[0].phoneCode;

    if (customer?.phoneNumber) {
      const phone = parsePhoneNumberFromString(customer.phoneNumber);
      if (phone) {
        nationalNumber = phone.nationalNumber;
        countryCallingCode = phone.countryCallingCode;
      }
    }

    return {
      firstName: customer?.firstName ?? undefined,
      lastName: customer?.lastName ?? undefined,
      language: customer?.language,
      email: customer?.email,
      phoneNumber: {
        nationalNumber,
        countryCallingCode,
      },
      marketingEmails: customer?.marketingEmails || false,
      marketingSMS: customer?.marketingSMS || false,
      notes: customer?.notes || undefined,
      tagIds: [],
    };
  }

  useEffect(() => {
    if (!customer) return;
    form.reset(getInitialValues(customer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const onSubmit = async (data: CustomerFormValues) => {
    const customerData = {
      firstName: data.firstName,
      lastName: data.lastName,
      language: data.language,
      email: data.email,
      phoneNumber: data.phoneNumber?.nationalNumber
        ? `+${data.phoneNumber?.countryCallingCode}${data.phoneNumber?.nationalNumber}`
        : undefined,
      marketingEmails: data.marketingEmails,
      marketingSMS: data.marketingSMS,
      notes: data.notes,
    };
    if (isEditMode) {
      await updateCustomer(customerData);
      return;
    }
    const createdCustomer = await createCustomer(customerData);
    router.push(`${DASHBOARD_PAGE_LINK}/customers/${createdCustomer.id}`);
  };

  const address = customer?.billingAddress?.address;

  const selectedCountry = getCountryFromPhoneCode(
    form.watch('phoneNumber')?.countryCallingCode ?? ''
  );
  const isSubmitDisabled =
    updating || creating || (isEditMode ? !isValid || !isDirty : !isValid);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create New Customer
            </h2>
            <p className="text-sm text-muted-foreground">
              Add a new customer to your store
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href={`${DASHBOARD_PAGE_LINK}/customers`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Customers
              </Link>
            </Button>
            <Button form="create-customer-form" disabled={isSubmitDisabled}>
              {updating || creating
                ? 'Saving...'
                : isEditMode
                ? 'Update customer'
                : 'Create customer'}
            </Button>
          </div>
        </div>
        <Separator />
        <Form {...form}>
          <form
            id="create-customer-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <div className="flex items-center">
                                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Select a language" />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LANGUAGES.map((language) => (
                              <SelectItem
                                key={language.value}
                                value={language.value}
                              >
                                {language.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This customer will receive notifications in this
                          language.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber.nationalNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Select
                              name="phoneNumber.countryCallingCode"
                              value={form.watch(
                                'phoneNumber.countryCallingCode'
                              )}
                              onValueChange={(value) =>
                                form.setValue(
                                  'phoneNumber.countryCallingCode',
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue>
                                  {selectedCountry?.flag}{' '}
                                  {selectedCountry?.phoneCode}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRIES.map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.phoneCode}
                                  >
                                    {country.flag} ({country.phoneCode}){' '}
                                    {country.name}
                                  </SelectItem>
                                ))}
                                {/* Add more country codes as needed */}
                              </SelectContent>
                            </Select>
                            <div className="relative flex-1 ml-2">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <Input
                                className="pl-10"
                                placeholder="712345678"
                                {...field}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marketingEmails"
                    disabled={form.watch('email') === ''}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Marketing Emails
                          </FormLabel>
                          <FormDescription>
                            Receive emails about new products, features, and
                            more.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={field.disabled}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marketingSMS"
                    disabled={form.watch('phoneNumber.nationalNumber') === ''}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Marketing SMS
                          </FormLabel>
                          <FormDescription>
                            Receive SMS about promotions, discounts, and events.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={field.disabled}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormDescription>
                    You should ask your customers for permission before you
                    subscribe them to your marketing emails or SMS.
                  </FormDescription>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Default Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {address ? (
                      <div className="space-y-1">
                        <p>{address.line1}</p>
                        <p>{address.line2}</p>
                        <p>
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No address set
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start mt-4"
                      onClick={() => setIsAddressDialogOpen(true)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {address ? 'Edit address' : 'Add address'}
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add a note..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Notes are private and won&apos;t be shared with the
                            customer.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="tagIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder="Search for or create a tag"
                                className="pl-10"
                                onKeyDown={(e) => {
                                  if (
                                    e.key === 'Enter' &&
                                    e.currentTarget.value
                                  ) {
                                    e.preventDefault();
                                    field.onChange([
                                      ...field.value,
                                      e.currentTarget.value,
                                    ]);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            <FormDescription>
                              Add relevant tags to improve customer
                              discoverability. Press Enter after each tag.
                            </FormDescription>
                          </FormDescription>
                          <FormMessage />
                          <div className="mt-2 flex flex-wrap gap-2">
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
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
      {console.log(customer)}
      {customer && (
        <AddressDialog
          ownerId={customer.id}
          type={AddressType.Billing}
          ownerType={AddressOwnerType.Customer}
          isOpen={isAddressDialogOpen}
          onOpenChange={setIsAddressDialogOpen}
          addressOwnerId={customer?.billingAddress?.id}
          onComplete={refetchCustomer}
        />
      )}
    </>
  );
}
