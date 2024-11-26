'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Users,
  FolderOpen,
  Plus,
  ArrowRight,
  ShoppingCart,
  Settings,
  Activity,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  EmptyPlaceholder,
  EmptyPlaceholderIcon,
  EmptyPlaceholderTitle,
  EmptyPlaceholderDescription,
} from './(components)/empty-placeholder';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useOverview } from '@/admin/hooks/overview';
import { useStore } from '@/admin/hooks/store';

interface DashboardCard {
  id: string;
  title: string;
  visible: boolean;
}

interface DashboardSection {
  id: string;
  title: string;
  visible: boolean;
  cards: DashboardCard[];
}

interface Stats {
  totalProducts: number;
  totalCollections: number;
  totalCustomers: number;
  totalOrders: number;
  revenue: number;
  averageOrderValue: number;
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'completed' | 'processing' | 'shipped';
  isNew: boolean;
}

interface Activity {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar: string;
  };
}

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  linkHref: string;
}

interface OrderStatusBadgeProps {
  status: Order['status'];
}

export default function DashboardOverview() {
  const { store } = useStore();
  const { overview, loading } = useOverview({ storeId: store?.id });
  console.log({ overview });
  const [sections, setSections] = useState<DashboardSection[]>([
    {
      id: 'stats',
      title: 'Statistics',
      visible: true,
      cards: [
        { id: 'totalProducts', title: 'Total Products', visible: true },
        { id: 'collections', title: 'Collections', visible: true },
        { id: 'customers', title: 'Customers', visible: true },
        { id: 'totalOrders', title: 'Total Orders', visible: true },
      ],
    },
    {
      id: 'revenue',
      title: 'Revenue Metrics',
      visible: true,
      cards: [
        { id: 'revenue', title: 'Revenue', visible: true },
        {
          id: 'averageOrderValue',
          title: 'Average Order Value',
          visible: true,
        },
        { id: 'conversionRate', title: 'Conversion Rate', visible: true },
      ],
    },
    {
      id: 'orders',
      title: 'Recent Orders',
      visible: true,
      cards: [{ id: 'recentOrders', title: 'Recent Orders', visible: true }],
    },
    {
      id: 'activities',
      title: 'Recent Activities',
      visible: true,
      cards: [
        { id: 'recentActivities', title: 'Recent Activities', visible: true },
      ],
    },
  ]);

  const [hasData, setHasData] = useState(false);

  const [stats] = useState<Stats>({
    totalProducts: 150,
    totalCollections: 12,
    totalCustomers: 1024,
    totalOrders: 256,
    revenue: 25600,
    averageOrderValue: 100,
  });

  const [recentOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      customer: 'John Doe',
      total: 150,
      status: 'completed',
      isNew: true,
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      total: 89.99,
      status: 'processing',
      isNew: true,
    },
    {
      id: 'ORD003',
      customer: 'Bob Johnson',
      total: 299.99,
      status: 'completed',
      isNew: false,
    },
    {
      id: 'ORD004',
      customer: 'Alice Brown',
      total: 79.99,
      status: 'shipped',
      isNew: false,
    },
    {
      id: 'ORD005',
      customer: 'Charlie Davis',
      total: 199.99,
      status: 'processing',
      isNew: false,
    },
  ]);

  const [recentActivities] = useState<Activity[]>([
    {
      id: '1',
      icon: <Package className="h-4 w-4" />,
      title: 'New product added',
      description: 'Wireless Earbuds X1000',
      timestamp: '2 hours ago',
      user: {
        name: 'Emily Johnson',
        avatar: '/placeholder.svg?height=32&width=32',
      },
    },
    {
      id: '2',
      icon: <FolderOpen className="h-4 w-4" />,
      title: 'Collection created',
      description: 'Summer Essentials 2024',
      timestamp: '5 hours ago',
      user: {
        name: 'Michael Chen',
        avatar: '/placeholder.svg?height=32&width=32',
      },
    },
    {
      id: '3',
      icon: <Users className="h-4 w-4" />,
      title: 'New customer registered',
      description: 'johndoe@example.com',
      timestamp: '1 day ago',
    },
    {
      id: '4',
      icon: <ShoppingCart className="h-4 w-4" />,
      title: 'New order received',
      description: 'Order #1234 - $250.00',
      timestamp: '1 day ago',
      user: {
        name: 'Sarah Thompson',
        avatar: '/placeholder.svg?height=32&width=32',
      },
    },
    {
      id: '5',
      icon: <Package className="h-4 w-4" />,
      title: 'Product updated',
      description: 'Smart Watch Pro - Price changed',
      timestamp: '2 days ago',
      user: {
        name: 'Alex Rodriguez',
        avatar: '/placeholder.svg?height=32&width=32',
      },
    },
  ]);

  useEffect(() => {
    const savedSections = localStorage.getItem('dashboardSections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }

    // Simulating data check
    // In a real application, you would check if there's actual data
    setHasData(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardSections', JSON.stringify(sections));
  }, [sections]);

  const toggleSection = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              visible: !section.visible,
              cards: section.cards.map((card) => ({
                ...card,
                visible: !section.visible,
              })),
            }
          : section
      )
    );
  };

  const toggleCard = (sectionId: string, cardId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              cards: section.cards.map((card) =>
                card.id === cardId ? { ...card, visible: !card.visible } : card
              ),
            }
          : section
      )
    );
  };

  if (!overview && loading) {
    return <>Loading...</>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/products/create">
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Customize Dashboard
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Dashboard Sections</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sections.map((section) =>
                section.id === 'orders' || section.id === 'activities' ? (
                  <DropdownMenuItem
                    key={section.id}
                    onSelect={(e) => {
                      e.preventDefault();
                      toggleSection(section.id);
                    }}
                  >
                    <label className="flex items-center">
                      <Checkbox
                        checked={section.visible}
                        // onCheckedChange={() => toggleSection(section.id)}
                        className="mr-2"
                      />
                      {section.title}
                    </label>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuSub key={section.id}>
                    <DropdownMenuSubTrigger
                      onClick={() => toggleSection(section.id)}
                    >
                      <label className="flex items-center">
                        <Checkbox
                          checked={section.visible}
                          // onCheckedChange={() => toggleSection(section.id)}
                          className="mr-2"
                        />
                        {section.title}
                      </label>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {section.cards.map((card) => (
                          <DropdownMenuItem
                            key={card.id}
                            onSelect={(e) => {
                              e.preventDefault();
                              toggleCard(section.id, card.id);
                            }}
                          >
                            <Checkbox
                              checked={card.visible}
                              onCheckedChange={() =>
                                toggleCard(section.id, card.id)
                              }
                              className="mr-2"
                            />
                            {card.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!hasData && (
        <Card>
          <CardHeader>
            <CardTitle>Let&apos;s Get Your Store Up and Running!</CardTitle>
            <CardDescription>
              Take the first steps to launch your successful online business.
              Start by setting up these key areas:
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <EmptyPlaceholder>
              <EmptyPlaceholderIcon>
                <Package className="h-8 w-8 text-muted-foreground" />
              </EmptyPlaceholderIcon>
              <EmptyPlaceholderTitle>No products yet</EmptyPlaceholderTitle>
              <EmptyPlaceholderDescription>
                Add your first product to get started.
              </EmptyPlaceholderDescription>
              <Button asChild>
                <Link href="/dashboard/products/create">Add Product</Link>
              </Button>
            </EmptyPlaceholder>
            <EmptyPlaceholder>
              <EmptyPlaceholderIcon>
                <Users className="h-8 w-8 text-muted-foreground" />
              </EmptyPlaceholderIcon>
              <EmptyPlaceholderTitle>No customers yet</EmptyPlaceholderTitle>
              <EmptyPlaceholderDescription>
                Customers will appear here once they make a purchase.
              </EmptyPlaceholderDescription>
              <Button variant="outline" asChild>
                <Link href="/dashboard/marketing">Set Up Marketing</Link>
              </Button>
            </EmptyPlaceholder>
            <EmptyPlaceholder>
              <EmptyPlaceholderIcon>
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </EmptyPlaceholderIcon>
              <EmptyPlaceholderTitle>No orders yet</EmptyPlaceholderTitle>
              <EmptyPlaceholderDescription>
                Your orders will show up here once you start selling.
              </EmptyPlaceholderDescription>
              <Button variant="outline" asChild>
                <Link href="/dashboard/products">Manage Products</Link>
              </Button>
            </EmptyPlaceholder>
            <EmptyPlaceholder>
              <EmptyPlaceholderIcon>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </EmptyPlaceholderIcon>
              <EmptyPlaceholderTitle>No recent activity</EmptyPlaceholderTitle>
              <EmptyPlaceholderDescription>
                Your store&apos;s activity will be displayed here as you use the
                platform.
              </EmptyPlaceholderDescription>
            </EmptyPlaceholder>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/settings">
                Complete Store Setup <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {hasData && (
        <>
          {sections.find((s) => s.id === 'stats')?.visible && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {' '}
              {/* Update 1: Increased gap and adjusted responsive layout */}
              {sections
                .find((s) => s.id === 'stats')
                ?.cards.find((c) => c.id === 'totalProducts')?.visible && (
                <StatsCard
                  title="Total Products"
                  value={stats.totalProducts}
                  description="Active products in your store"
                  icon={<Package className="h-6 w-6" />}
                  linkHref="/dashboard/products"
                />
              )}
              {sections
                .find((s) => s.id === 'stats')
                ?.cards.find((c) => c.id === 'collections')?.visible && (
                <StatsCard
                  title="Collections"
                  value={stats.totalCollections}
                  description="Product collections"
                  icon={<FolderOpen className="h-6 w-6" />}
                  linkHref="/dashboard/collections"
                />
              )}
              {sections
                .find((s) => s.id === 'stats')
                ?.cards.find((c) => c.id === 'customers')?.visible && (
                <StatsCard
                  title="Customers"
                  value={stats.totalCustomers}
                  description="Registered customers"
                  icon={<Users className="h-6 w-6" />}
                  linkHref="/dashboard/customers"
                />
              )}
              {sections
                .find((s) => s.id === 'stats')
                ?.cards.find((c) => c.id === 'totalOrders')?.visible && (
                <StatsCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  description="Orders received"
                  icon={<ShoppingCart className="h-6 w-6" />}
                  linkHref="/dashboard/orders"
                />
              )}
            </div>
          )}

          {sections.find((s) => s.id === 'revenue')?.visible && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sections
                .find((s) => s.id === 'revenue')
                ?.cards.find((c) => c.id === 'revenue')?.visible && (
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.revenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>
              )}
              {sections
                .find((s) => s.id === 'revenue')
                ?.cards.find((c) => c.id === 'averageOrderValue')?.visible && (
                <Card>
                  <CardHeader>
                    <CardTitle>Average Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.averageOrderValue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>
              )}
              {sections
                .find((s) => s.id === 'revenue')
                ?.cards.find((c) => c.id === 'conversionRate')?.visible && (
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-muted-foreground">
                      +0.5% from last month
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {sections.find((s) => s.id === 'orders')?.visible &&
              sections
                .find((s) => s.id === 'orders')
                ?.cards.find((c) => c.id === 'recentOrders')?.visible && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentOrders.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentOrders.map((order) => (
                            <TableRow
                              key={order.id}
                              className={
                                order.isNew
                                  ? 'bg-green-50 dark:bg-green-900/20'
                                  : ''
                              }
                            >
                              <TableCell className="font-medium">
                                {order.id}
                                {order.isNew && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-green-500 text-white border-green-500"
                                  >
                                    New
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell>${order.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <OrderStatusBadge status={order.status} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <EmptyPlaceholder>
                        <EmptyPlaceholderIcon>
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </EmptyPlaceholderIcon>
                        <EmptyPlaceholderTitle>
                          No orders yet
                        </EmptyPlaceholderTitle>
                        <EmptyPlaceholderDescription>
                          When you start receiving orders, they will appear
                          here.
                        </EmptyPlaceholderDescription>
                      </EmptyPlaceholder>
                    )}
                  </CardContent>
                  {recentOrders.length > 0 ? (
                    <CardFooter>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href="/dashboard/orders">
                          View All Orders{' '}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  ) : null}
                </Card>
              )}

            {sections.find((s) => s.id === 'activities')?.visible &&
              sections
                .find((s) => s.id === 'activities')
                ?.cards.find((c) => c.id === 'recentActivities')?.visible && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.length > 0 ? (
                        <div className="space-y-8">
                          {recentActivities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center space-x-4"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {activity.icon}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-sm font-medium leading-none">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {activity.description}
                                </p>
                                {activity.user && (
                                  <div className="flex items-center mt-1">
                                    <Avatar className="h-5 w-5 mr-1">
                                      <AvatarImage
                                        src={activity.user.avatar}
                                        alt={activity.user.name}
                                      />
                                      <AvatarFallback>
                                        {activity.user.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">
                                      {activity.user.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground whitespace-nowrap">
                                {activity.timestamp}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyPlaceholder>
                          <EmptyPlaceholderIcon>
                            <Activity className="h-8 w-8 text-muted-foreground" />
                          </EmptyPlaceholderIcon>
                          <EmptyPlaceholderTitle>
                            No recent activity
                          </EmptyPlaceholderTitle>
                          <EmptyPlaceholderDescription>
                            Your store&apos;s activity will be displayed here as
                            you use the platform.
                          </EmptyPlaceholderDescription>
                        </EmptyPlaceholder>
                      )}
                    </div>
                  </CardContent>
                  {recentActivities.length > 0 ? (
                    <CardFooter>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href="/dashboard/activity">
                          View All Activity{' '}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  ) : null}
                </Card>
              )}
          </div>
        </>
      )}
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  linkHref,
}: StatsCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      {' '}
      {/* Update 2: Simplified StatsCard component */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let color: string;
  switch (status) {
    case 'completed':
      color = 'bg-green-500 hover:bg-green-600';
      break;
    case 'processing':
      color = 'bg-blue-500 hover:bg-blue-600';
      break;
    case 'shipped':
      color = 'bg-purple-500 hover:bg-purple-600';
      break;
    default:
      color = 'bg-gray-500 hover:bg-gray-600';
  }
  return (
    <Badge className={`${color} text-white`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
