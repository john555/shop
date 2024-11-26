import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import { OrderStatus, ProductStatus } from '@prisma/client';
import { StoreOverview, RecentOrder, RecentActivity, ActivityType } from './overview.entity';

@Injectable()
export class OverviewService {
  private readonly logger = new Logger(OverviewService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getProductStats(storeId: string): Promise<{ total: number; active: number }> {
    const [total, active] = await Promise.all([
      this.prisma.product.count({
        where: { storeId },
      }),
      this.prisma.product.count({
        where: {
          storeId,
          status: ProductStatus.ACTIVE,
        },
      }),
    ]);
    return { total, active };
  }

  private async getRevenueStats(
    storeId: string,
  ): Promise<{ current: number; previous: number }> {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [currentRevenue, previousRevenue] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          storeId,
          status: { in: [OrderStatus.PAID, OrderStatus.FULFILLED, OrderStatus.DELIVERED] },
          createdAt: { gte: firstDayCurrentMonth },
        },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: {
          storeId,
          status: { in: [OrderStatus.PAID, OrderStatus.FULFILLED, OrderStatus.DELIVERED] },
          createdAt: {
            gte: firstDayPreviousMonth,
            lt: firstDayCurrentMonth,
          },
        },
        _sum: { total: true },
      }),
    ]);

    return {
      current: currentRevenue._sum.total?.toNumber() ?? 0,
      previous: previousRevenue._sum.total?.toNumber() ?? 0,
    };
  }

  private async getAverageOrderValue(
    storeId: string,
  ): Promise<{ current: number; previous: number }> {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [currentMonth, previousMonth] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          storeId,
          status: { in: [OrderStatus.PAID, OrderStatus.FULFILLED, OrderStatus.DELIVERED] },
          createdAt: { gte: firstDayCurrentMonth },
        },
        _avg: { total: true },
      }),
      this.prisma.order.aggregate({
        where: {
          storeId,
          status: { in: [OrderStatus.PAID, OrderStatus.FULFILLED, OrderStatus.DELIVERED] },
          createdAt: {
            gte: firstDayPreviousMonth,
            lt: firstDayCurrentMonth,
          },
        },
        _avg: { total: true },
      }),
    ]);

    return {
      current: currentMonth._avg.total?.toNumber() ?? 0,
      previous: previousMonth._avg.total?.toNumber() ?? 0,
    };
  }

  private calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  private async getRecentOrders(storeId: string): Promise<RecentOrder[]> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const orders = await this.prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        customerName: true,
        createdAt: true,
      },
    });

    return orders.map(order => ({
      id: order.orderNumber,
      customerName: order.customerName ?? 'Guest Customer',
      total: order.total.toNumber(),
      status: order.status,
      isNew: order.createdAt > twentyFourHoursAgo,
    }));
  }

  private async getRecentActivities(storeId: string): Promise<RecentActivity[]> {
    // Get various types of recent activities
    const [orderEvents, products, collections, customers] = await Promise.all([
      this.prisma.orderEvent.findMany({
        where: { order: { storeId } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          order: true,
        },
      }),
      this.prisma.product.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          store: {
            include: {
              owner: true,
            },
          },
        },
      }),
      this.prisma.collection.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          store: {
            include: {
              owner: true,
            },
          },
        },
      }),
      this.prisma.customer.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);
  
    // Combine and sort all activities
    const allActivities: RecentActivity[] = [
      ...products.map(product => ({
        id: `product-${product.id}`,
        type: ActivityType.PRODUCT_ADDED,
        title: 'New product added',
        description: product.title,
        timestamp: product.createdAt,
        user: product.store.owner ? {
          name: `${product.store.owner.firstName} ${product.store.owner.lastName}`.trim(),
          avatar: `/api/avatar/${product.store.owner.id}`,
        } : undefined,
      })),
      ...collections.map(collection => ({
        id: `collection-${collection.id}`,
        type: ActivityType.COLLECTION_CREATED,
        title: 'Collection created',
        description: collection.name,
        timestamp: collection.createdAt,
        user: collection.store.owner ? {
          name: `${collection.store.owner.firstName} ${collection.store.owner.lastName}`.trim(),
          avatar: `/api/avatar/${collection.store.owner.id}`,
        } : undefined,
      })),
      ...customers.map(customer => ({
        id: `customer-${customer.id}`,
        type: ActivityType.CUSTOMER_REGISTERED,
        title: 'New customer registered',
        description: `${customer.firstName} ${customer.lastName}`.trim(),
        timestamp: customer.createdAt,
      })),
      ...orderEvents.map(event => ({
        id: `order-${event.id}`,
        type: ActivityType.ORDER_RECEIVED,
        title: 'New order received',
        description: `Order #${event.order.orderNumber} - ${event.description}`,
        timestamp: event.createdAt,
      })),
    ];
  
    // Sort by timestamp descending and take the most recent 5
    return allActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  }
  

  async getStoreOverview(storeId: string): Promise<StoreOverview> {
    try {
      const [
        productStats,
        collectionsCount,
        customersCount,
        ordersCount,
        revenueStats,
        avgOrderValue,
        recentOrders,
        recentActivities,
      ] = await Promise.all([
        this.getProductStats(storeId),
        this.prisma.collection.count({ where: { storeId } }),
        this.prisma.customer.count({ where: { storeId } }),
        this.prisma.order.count({ where: { storeId } }),
        this.getRevenueStats(storeId),
        this.getAverageOrderValue(storeId),
        this.getRecentOrders(storeId),
        this.getRecentActivities(storeId),
      ]);

      return {
        totalProducts: productStats.total,
        productsSubtext: `${productStats.active} active products in your store`,
        collections: collectionsCount,
        collectionsSubtext: 'Product collections',
        customers: customersCount,
        customersSubtext: 'Registered customers',
        totalOrders: ordersCount,
        ordersSubtext: 'Orders received',
        revenue: revenueStats.current,
        revenueGrowth: this.calculateGrowthRate(revenueStats.current, revenueStats.previous),
        averageOrderValue: avgOrderValue.current,
        orderValueGrowth: this.calculateGrowthRate(avgOrderValue.current, avgOrderValue.previous),
        conversionRate: 3.2, // This would need to be calculated based on actual visitor data
        conversionRateGrowth: 0.5,
        recentOrders,
        recentActivities,
      };
    } catch (error) {
      this.logger.error(`Failed to get store overview for ${storeId}:`, error);
      throw error;
    }
  }
}