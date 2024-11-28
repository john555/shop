'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  Users,
  FolderOpen,
  ShoppingCart,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  createdAt: string;
  type: 'product' | 'customer' | 'order' | 'collection';
  user?: {
    name: string;
    avatar: string;
  };
}

const activityData: Activity[] = [
  {
    id: '1',
    icon: <Package className="h-4 w-4" />,
    title: 'New product added',
    description: 'Wireless Earbuds X1000',
    createdAt: '2 hours ago',
    type: 'product',
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
    createdAt: '5 hours ago',
    type: 'collection',
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
    createdAt: '1 day ago',
    type: 'customer',
  },
  {
    id: '4',
    icon: <ShoppingCart className="h-4 w-4" />,
    title: 'New order received',
    description: 'Order #1234 - $250.00',
    createdAt: '1 day ago',
    type: 'order',
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
    createdAt: '2 days ago',
    type: 'product',
    user: {
      name: 'Alex Rodriguez',
      avatar: '/placeholder.svg?height=32&width=32',
    },
  },
  {
    id: '6',
    icon: <ShoppingCart className="h-4 w-4" />,
    title: 'Order shipped',
    description: 'Order #1235 - Shipped via FedEx',
    createdAt: '3 days ago',
    type: 'order',
    user: {
      name: 'Lisa Wang',
      avatar: '/placeholder.svg?height=32&width=32',
    },
  },
  {
    id: '7',
    icon: <Users className="h-4 w-4" />,
    title: 'Customer support ticket resolved',
    description: 'Ticket #5678 - Product return inquiry',
    createdAt: '4 days ago',
    type: 'customer',
    user: {
      name: 'David Brown',
      avatar: '/placeholder.svg?height=32&width=32',
    },
  },
];

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>(activityData);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const filteredActivities = activities.filter((activity) => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch =
      activity.title.toLowerCase().includes(search.toLowerCase()) ||
      activity.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsFilterOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>

        <Button
          variant="ghost"
          className="p-0 sm:hidden"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Badge variant="outline" className="p-2 ml-auto gap-1">
            <Filter className="h-4 w-4 mr-2" />
            {isFilterOpen ? 'Hide' : 'Show'} Filters
          </Badge>
        </Button>
      </div>

      {isFilterOpen && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="product">Products</SelectItem>
              <SelectItem value="customer">Customers</SelectItem>
              <SelectItem value="order">Orders</SelectItem>
              <SelectItem value="collection">Collections</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            A detailed log of recent actions and events in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-muted hover:scale-[1.02]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {activity.icon}
                </div>
                <div className="flex-grow space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center pt-1">
                    {activity.user && (
                      <>
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={activity.user.avatar}
                            alt={activity.user.name}
                          />
                          <AvatarFallback>
                            {activity.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground mr-2">
                          {activity.user.name}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {activity.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Load More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
