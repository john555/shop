'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Store, MapPin, Phone, MessageCircle, Facebook, Instagram, Pencil, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { z } from "zod";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from '@/components/ui/separator'


type StoreProfile = {
  name: string;
  phone: string;
  email: string;
  whatsApp: string;
  facebook: string;
  instagram: string;
}

type OrderId = {
  prefix: string;
  suffix: string;
}

type StoreDefaults = {
  currency: string;
  currencySymbol: string;
  currencyPosition: "before" | "after";
  showCurrencyCode: boolean;
  unitSystem: "metric" | "imperial";
  weightUnit: "kg" | "g" | "lb" | "oz";
  timeZone: string;
}

type Address = {
  country: string;
  state: string;
  city: string;
  line1: string;
  line2: string;
  zipCode: string;
}

const countries = [
  { value: "UG", label: "Uganda" },
  { value: "KE", label: "Kenya" },
  { value: "TZ", label: "Tanzania" },
  { value: "RW", label: "Rwanda" },
  { value: "BI", label: "Burundi" },
  { value: "SS", label: "South Sudan" },
  { value: "ET", label: "Ethiopia" },
  { value: "SO", label: "Somalia" },
  { value: "CD", label: "Democratic Republic of the Congo" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
]

const storeProfileSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State/Province/Region is required"),
  city: z.string().min(1, "City/Town/Municipality is required"),
  line1: z.string().min(1, "Street address is required"),
  line2: z.string().optional(),
  zipCode: z.string().min(1, "Postal/ZIP code is required"),
});

const storeSettingsSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
  currencyPosition: z.enum(["before", "after"], {
    required_error: "Currency position is required",
  }),
  showCurrencyCode: z.boolean(),
  unitSystem: z.enum(["metric", "imperial"], {
    required_error: "Unit system is required",
  }),
  weightUnit: z.enum(["kg", "g", "lb", "oz"], {
    required_error: "Weight unit is required",
  }),
  timeZone: z.string().min(1, "Time zone is required"),
  orderIdPrefix: z.string().min(1, "Order ID prefix is required"),
  orderIdSuffix: z.string().optional(),
});

export default function StoreSettingsPage() {
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false)
  const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false)
  const [isEditSocialMediaDialogOpen, setIsEditSocialMediaDialogOpen] = useState(false)
  const [storeProfile, setStoreProfile] = useState<StoreProfile>({
    name: "Kampala Crafts",
    phone: "+256 700 123456",
    email: "info@kampalacrafts.ug",
    whatsApp: "+256 700 123456",
    facebook: "kampalacraftsug",
    instagram: "@kampalacrafts"
  })
  const [orderId, setOrderId] = useState<OrderId>({ prefix: "#", suffix: "" })
  const [storeDefaults, setStoreDefaults] = useState<StoreDefaults>({
    currency: "UGX",
    currencySymbol: "USh",
    currencyPosition: "before",
    showCurrencyCode: true,
    unitSystem: "metric",
    weightUnit: "kg",
    timeZone: "eat"
  })
  const [address, setAddress] = useState<Address>({
    country: "Uganda",
    state: "Central Region",
    city: "Kampala",
    line1: "123 Main St",
    line2: "Suite 456",
    zipCode: "00256"
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [changedFields, setChangedFields] = useState<Record<string, any>>({});

  const methods = useForm<z.infer<typeof storeSettingsSchema>>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      ...storeDefaults,
      orderIdPrefix: orderId.prefix,
      orderIdSuffix: orderId.suffix,
    },
    mode: "onBlur",
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<z.infer<typeof storeProfileSchema>>({
    resolver: zodResolver(storeProfileSchema),
    defaultValues: storeProfile,
  });

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressErrors },
  } = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: address,
  });


  const handleOrderIdInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setOrderId(prev => ({ ...prev, [id]: value }));
    setChangedFields(prev => ({...prev, [id]: value}));
    setHasChanges(true);
  }, []);


  const handleUnitSystemChange = (value: "metric" | "imperial") => {
    const defaultWeightUnit = value === "metric" ? "kg" : "lb";
    setStoreDefaults(prev => ({
      ...prev,
      unitSystem: value,
      weightUnit: defaultWeightUnit
    }));
    setChangedFields(prev => ({
      ...prev,
      unitSystem: value,
      weightUnit: defaultWeightUnit
    }));
    setHasChanges(true);
    methods.setValue("unitSystem", value, { shouldValidate: true });
    methods.setValue("weightUnit", defaultWeightUnit, { shouldValidate: true });
    methods.trigger("weightUnit");
  };

  useEffect(() => {
    if (storeDefaults.unitSystem === "metric" && !["kg", "g"].includes(storeDefaults.weightUnit)) {
      handleUnitSystemChange("metric");
    } else if (storeDefaults.unitSystem === "imperial" && !["lb", "oz"].includes(storeDefaults.weightUnit)) {
      handleUnitSystemChange("imperial");
    }
  }, [storeDefaults.unitSystem]);

  const onSubmitProfile = (data: z.infer<typeof storeProfileSchema>) => {
    setStoreProfile(prevProfile => ({
      ...prevProfile,
      ...data
    }));
    setChangedFields(prev => ({...prev, ...data}));
    setIsEditProfileDialogOpen(false);
  };

  const onSubmitAddress = (data: z.infer<typeof addressSchema>) => {
    setAddress(data);
    setChangedFields(prev => ({...prev, ...data}));
    setIsEditAddressDialogOpen(false);
  };

  const onSubmit = (data: z.infer<typeof storeSettingsSchema>) => {
    setStoreDefaults({
      currency: data.currency,
      currencySymbol: data.currencySymbol,
      currencyPosition: data.currencyPosition,
      showCurrencyCode: data.showCurrencyCode,
      unitSystem: data.unitSystem,
      weightUnit: data.weightUnit,
      timeZone: data.timeZone,
    });
    setOrderId({
      prefix: data.orderIdPrefix,
      suffix: data.orderIdSuffix || "",
    });
    setChangedFields({});
    setHasChanges(false);
    // Here you would typically send the data to your backend
    console.log('Submitting changes:', data);
  };

  const handleSaveChanges = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    methods.handleSubmit((data) => {
      onSubmit(data);
      setChangedFields({});
      setHasChanges(false);
    })();
  }, [methods, onSubmit]);

  const ValidatedInput = ({ name, ...props }) => {
    const { register, trigger } = useFormContext();
    return (
      <Input
        {...register(name)}
        {...props}
        onBlur={() => trigger(name)}
      />
    );
  };

  return (
    <>
    <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit)} className="container max-w-3xl mx-auto px-4 py-2 relative pb-16">
      <div className="flex justify-between items-center mb-6"> {/* Removed py-4 */}
        <h1 className="text-2xl font-semibold">General</h1>
      </div>

      <div className="space-y-4">
        {/* Store Details Card */}
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">Store details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{storeProfile.name}</span>
                </div>
                <div className="text-sm text-muted-foreground pl-8">
                  <div>{storeProfile.phone}</div>
                  <div>{storeProfile.email}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditProfileDialogOpen(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Business address</div>
                  <div className="text-muted-foreground">
                    {address.line1}, {address.line2 && `${address.line2}, `}
                    {address.city}, {address.state}, {address.country} {address.zipCode}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditAddressDialogOpen(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="py-2">
              <Separator />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Contact and Social Media</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsEditSocialMediaDialogOpen(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-muted-foreground">{storeProfile.whatsApp}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Facebook className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Facebook</div>
                    <div className="text-muted-foreground">{storeProfile.facebook}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Instagram</div>
                    <div className="text-muted-foreground">{storeProfile.instagram}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Defaults Card */}
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">Store defaults</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-4">
            {/* Currency Display */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Currency display</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {storeDefaults.currency === 'UGX' ? 'Ugandan Shilling (UGX)' :
                       storeDefaults.currency === 'KES' ? 'Kenyan Shilling (KES)' :
                       storeDefaults.currency === 'TZS' ? 'Tanzanian Shilling (TZS)' :
                       storeDefaults.currency === 'RWF' ? 'Rwandan Franc (RWF)' :
                       storeDefaults.currency === 'BIF' ? 'Burundian Franc (BIF)' :
                       storeDefaults.currency === 'SSP' ? 'South Sudanese Pound (SSP)' :
                       'Select Currency'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => {setStoreDefaults(prev => ({...prev, currency: 'UGX', currencySymbol: 'USh'})); setChangedFields(prev => ({...prev, currency: 'UGX', currencySymbol: 'USh'})); setHasChanges(true);}}>Ugandan Shilling (UGX)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {setStoreDefaults(prev => ({...prev, currency: 'KES', currencySymbol: 'KSh'})); setChangedFields(prev => ({...prev, currency: 'KES', currencySymbol: 'KSh'})); setHasChanges(true);}}>Kenyan Shilling (KES)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {setStoreDefaults(prev => ({...prev, currency: 'TZS', currencySymbol: 'TSh'})); setChangedFields(prev => ({...prev, currency: 'TZS', currencySymbol: 'TSh'})); setHasChanges(true);}}>Tanzanian Shilling (TZS)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {setStoreDefaults(prev => ({...prev, currency: 'RWF', currencySymbol: 'RF'})); setChangedFields(prev => ({...prev, currency: 'RWF', currencySymbol: 'RF'})); setHasChanges(true);}}>Rwandan Franc (RWF)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {setStoreDefaults(prev => ({...prev, currency: 'BIF', currencySymbol: 'FBu'})); setChangedFields(prev => ({...prev, currency: 'BIF', currencySymbol: 'FBu'})); setHasChanges(true);}}>Burundian Franc (BIF)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {setStoreDefaults(prev => ({...prev, currency: 'SSP', currencySymbol: '£'})); setChangedFields(prev => ({...prev, currency: 'SSP', currencySymbol: '£'})); setHasChanges(true);}}>South Sudanese Pound (SSP)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Currency symbol</Label>
                <ValidatedInput
                  name="currencySymbol"
                  value={storeDefaults.currencySymbol}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setStoreDefaults(prev => ({ ...prev, currencySymbol: newValue }));
                    setChangedFields(prev => ({ ...prev, currencySymbol: newValue }));
                    setHasChanges(true);
                    methods.setValue("currencySymbol", newValue, { shouldValidate: true });
                  }}
                  placeholder="Enter currency symbol (e.g., $, €, £)"
                />
                {methods.formState.errors.currencySymbol && (
                  <p className="text-sm text-red-500">{methods.formState.errors.currencySymbol.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Currency position</Label>
                <Select
                  value={storeDefaults.currencyPosition}
                  onValueChange={(value: "before" | "after") => {
                    setStoreDefaults(prev => ({ ...prev, currencyPosition: value }));
                    setChangedFields(prev => ({...prev, currencyPosition: value}));
                    setHasChanges(true);
                  }}
                  {...methods.register("currencyPosition")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before amount (e.g., $100)</SelectItem>
                    <SelectItem value="after">After amount (e.g., 100$)</SelectItem>
                  </SelectContent>
                </Select>
                {methods.formState.errors.currencyPosition && (
                  <p className="text-sm text-red-500">{methods.formState.errors.currencyPosition.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showCurrencyCode"
                  checked={storeDefaults.showCurrencyCode}
                  onCheckedChange={(checked: boolean) => {
                    setStoreDefaults(prev => ({ ...prev, showCurrencyCode: checked }));
                    setChangedFields(prev => ({...prev, showCurrencyCode: checked}));
                    setHasChanges(true);
                  }}
                  {...methods.register("showCurrencyCode")}
                />
                <Label htmlFor="showCurrencyCode">Show currency code (e.g., USD, UGX)</Label>
              </div>
              <div className="text-sm text-muted-foreground">
                Example: {storeDefaults.currencyPosition === "before" ? (storeDefaults.showCurrencyCode ? `${storeDefaults.currency} ` : storeDefaults.currencySymbol) : ""}100{storeDefaults.currencyPosition === "after" ? (storeDefaults.showCurrencyCode ? ` ${storeDefaults.currency}` : storeDefaults.currencySymbol) : ""}
              </div>
            </div>

            {/* Unit System and Weight */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-medium">Unit system</Label>
                <Select value={storeDefaults.unitSystem} onValueChange={handleUnitSystemChange} {...methods.register("unitSystem")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric system</SelectItem>
                    <SelectItem value="imperial">Imperial system</SelectItem>
                  </SelectContent>
                </Select>
                {methods.formState.errors.unitSystem && (
                  <p className="text-sm text-red-500">{methods.formState.errors.unitSystem.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Default weight unit</Label>
                <Select
                  value={storeDefaults.weightUnit}
                  onValueChange={(value: "kg" | "g" | "lb" | "oz") => {
                    setStoreDefaults(prev => ({ ...prev, weightUnit: value }));
                    setChangedFields(prev => ({...prev, weightUnit: value}));
                    setHasChanges(true);
                    methods.setValue("weightUnit", value, { shouldValidate: true });
                  }}
                  {...methods.register("weightUnit")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeDefaults.unitSystem === "metric" ? (
                      <>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="lb">Pound (lb)</SelectItem>
                        <SelectItem value="oz">Ounce (oz)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {methods.formState.errors.weightUnit && (
                  <p className="text-sm text-red-500">{methods.formState.errors.weightUnit.message}</p>
                )}
              </div>
            </div>

            {/* Time Zone */}
            <div className="space-y-2">
              <Label className="font-medium">Time zone</Label>
              <Select value={storeDefaults.timeZone} onValueChange={(value) => {setStoreDefaults(prev => ({...prev, timeZone: value})); setChangedFields(prev => ({...prev, timeZone: value})); setHasChanges(true);}} {...methods.register("timeZone")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eat">(GMT+03:00) East Africa Time</SelectItem>
                  <SelectItem value="cat">(GMT+02:00) Central Africa Time</SelectItem>
                  <SelectItem value="wat">(GMT+01:00) West Africa Time</SelectItem>
                  <SelectItem value="gmt">(GMT+00:00) Greenwich Mean Time</SelectItem>
                </SelectContent>
              </Select>
              {methods.formState.errors.timeZone && (
                <p className="text-sm text-red-500">{methods.formState.errors.timeZone.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Sets the time for when orders and analytics are recorded
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              To change your user level time zone and language visit your{" "}
              <Link href="/settings/account" className="text-primary hover:underline">
                account settings
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Order ID Card */}
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">Order ID</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            <p className="text-sm text-muted-foreground">
              Shown on the order page, customer pages, and customer order notifications to identify order
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orderIdPrefix">Prefix</Label>
                <ValidatedInput
                  name="orderIdPrefix"
                  onChange={(e) => {
                    methods.register("orderIdPrefix").onChange(e);
                    handleOrderIdInputChange(e);
                  }}
                />
                {methods.formState.errors.orderIdPrefix && (
                  <p className="text-sm text-red-500">{methods.formState.errors.orderIdPrefix.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderIdSuffix">Suffix</Label>
                <ValidatedInput
                  name="orderIdSuffix"
                  onChange={(e) => {
                    methods.register("orderIdSuffix").onChange(e);
                    handleOrderIdInputChange(e);
                  }}
                />
                {methods.formState.errors.orderIdSuffix && (
                  <p className="text-sm text-red-500">{methods.formState.errors.orderIdSuffix.message}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your order ID will appear as {orderId.prefix}1001{orderId.suffix}, {orderId.prefix}1002{orderId.suffix}, {orderId.prefix}1003{orderId.suffix} ...
            </p>
          </CardContent>
        </Card>
      </div>
    </form>
    </FormProvider>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-4">
          <DialogHeader className="pb-2">
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription className="text-base">
              Update your store's basic information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <div className="space-y-4 py-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store name</Label>
                  <Input
                    id="name"
                    value={storeProfile.name}
                    onChange={(e) => {setStoreProfile(prev => ({...prev, name: e.target.value})); setChangedFields(prev => ({...prev, name: e.target.value})); setHasChanges(true);}}
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Appears on your website and receipts</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Store phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={storeProfile.phone}
                    onChange={(e) => {setStoreProfile(prev => ({...prev, phone: e.target.value})); setChangedFields(prev => ({...prev, phone: e.target.value})); setHasChanges(true);}}
                  />
                  {profileErrors.phone && (
                    <p className="text-sm text-red-500">{profileErrors.phone.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Include country code (e.g., +256 for Uganda)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Store email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeProfile.email}
                    onChange={(e) => {setStoreProfile(prev => ({...prev, email: e.target.value})); setChangedFields(prev => ({...prev, email: e.target.value})); setHasChanges(true);}}
                  />
                  {profileErrors.email && (
                    <p className="text-sm text-red-500">{profileErrors.email.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Receives messages about your store. For sender email, go to{" "}
                    <Link href="/notification-settings" className="text-primary hover:underline">
                      notification settings
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditProfileDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditAddressDialogOpen} onOpenChange={setIsEditAddressDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-4">
          <DialogHeader className="pb-2">
            <DialogTitle>Edit business address</DialogTitle>
            <DialogDescription className="text-base">
              Update your business address information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAddress(onSubmitAddress)}>
            <div className="space-y-4 py-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={address.country}
                    onValueChange={(value) => {setAddress(prev => ({...prev, country: value})); setChangedFields(prev => ({...prev, country: value})); setHasChanges(true);}}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.label}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {addressErrors.country && (
                    <p className="text-sm text-red-500">{addressErrors.country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province/Region</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) => {setAddress(prev => ({...prev, state: e.target.value})); setChangedFields(prev => ({...prev, state: e.target.value})); setHasChanges(true);}}
                  />
                  {addressErrors.state && (
                    <p className="text-sm text-red-500">{addressErrors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City/Town/Municipality</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => {setAddress(prev => ({...prev, city: e.target.value})); setChangedFields(prev => ({...prev, city: e.target.value})); setHasChanges(true);}}
                  />
                  {addressErrors.city && (
                    <p className="text-sm text-red-500">{addressErrors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line1">Street address, building number</Label>
                  <Input
                    id="line1"
                    value={address.line1}
                    onChange={(e) => {setAddress(prev => ({...prev, line1: e.target.value})); setChangedFields(prev => ({...prev, line1: e.target.value})); setHasChanges(true);}}
                  />
                  {addressErrors.line1 && (
                    <p className="text-sm text-red-500">{addressErrors.line1.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line2">Suite, apartment, unit number (optional)</Label>
                  <Input
                    id="line2"
                    value={address.line2}
                    onChange={(e) => {setAddress(prev => ({...prev, line2: e.target.value})); setChangedFields(prev => ({...prev, line2: e.target.value})); setHasChanges(true);}}
                  />
                  {addressErrors.line2 && (
                    <p className="text-sm text-red-500">{addressErrors.line2.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Postal/ZIP code</Label>
                  <Input
                    id="zipCode"
                    value={address.zipCode}
                    onChange={(e) => {setAddress(prev => ({...prev, zipCode: e.target.value})); setChangedFields(prev => ({...prev, zipCode: e.target.value})); setHasChanges(true);}}
                  />
                  {addressErrors.zipCode && (
                    <p className="text-sm text-red-500">{addressErrors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditAddressDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Contact and Social Media Dialog */}
      <Dialog open={isEditSocialMediaDialogOpen} onOpenChange={setIsEditSocialMediaDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-4">
          <DialogHeader className="pb-2">
            <DialogTitle>Edit Contact and Social Media</DialogTitle>
            <DialogDescription className="text-base">
              Update your store's contact and social media information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <div className="space-y-4 py-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsApp">WhatsApp</Label>
                  <Input
                    id="whatsApp"
                    value={storeProfile.whatsApp}
                    onChange={(e) => {setStoreProfile(prev => ({...prev, whatsApp: e.target.value})); setChangedFields(prev => ({...prev, whatsApp: e.target.value})); setHasChanges(true);}}
                    placeholder="+256 700 123456"
                  />
                  {profileErrors.whatsApp && (
                    <p className="text-sm text-red-500">{profileErrors.whatsApp.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground">WhatsApp number for customer support</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={storeProfile.facebook}
                    onChange={(e) => {setStoreProfile(prev => ({...prev, facebook: e.target.value})); setChangedFields(prev => ({...prev, facebook: e.target.value})); setHasChanges(true);}}
                    placeholder="kampalacraftsug"
                  />
                  {profileErrors.facebook && (
                    <p className="text-sm text-red-500">{profileErrors.facebook.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Your Facebook page name or URL</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={storeProfile.instagram}
                    onChange={(e) => {setStoreProfile(prev => ({...prev, instagram: e.target.value})); setChangedFields(prev => ({...prev, instagram: e.target.value})); setHasChanges(true);}}
                    placeholder="@kampalacrafts"
                  />
                  {profileErrors.instagram && (
                    <p className="text-sm text-red-500">{profileErrors.instagram.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Your Instagram handle (with @)</p>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditSocialMediaDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-md p-4 flex justify-end items-center z-50">
          <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      )}
    </>
  )
}