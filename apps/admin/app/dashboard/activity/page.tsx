'use client';

import { useState } from 'react';
import {
  Package,
  Users,
  FolderOpen,
  ShoppingCart,
  ArrowRight,
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

export default function ActivityPage() {
  const [activities] = useState<Activity[]>([
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
    {
      id: '6',
      icon: <ShoppingCart className="h-4 w-4" />,
      title: 'Order shipped',
      description: 'Order #1235 - Shipped via FedEx',
      timestamp: '3 days ago',
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
      timestamp: '4 days ago',
      user: {
        name: 'David Brown',
        avatar: '/placeholder.svg?height=32&width=32',
      },
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            A detailed log of recent actions and events in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {activities.map((activity) => (
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
                      {activity.timestamp}
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
