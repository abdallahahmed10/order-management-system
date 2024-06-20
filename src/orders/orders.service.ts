import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Order, OrderItem } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number): Promise<Order> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for the user');
    }

    if (!cart.cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    try {
      const order = await this.prisma.order.create({
        data: {
          userId,
          status: 'Pending',
          orderItems: {
            create: cart.cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });

      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.cartId } });

      return order;
    } catch (error) {
      throw new ConflictException('Failed to create order');
    }
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { orderItems: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    try {
      const order = await this.prisma.order.update({
        where: { orderId },
        data: { status },
      });

      return order;
    } catch (error) {
      throw new NotFoundException('Order not found');
    }
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: { orderItems: { include: { product: true } } },
      });

      if (!orders.length) {
        throw new NotFoundException('No orders found for the user');
      }

      return orders;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve orders for the user');
    }
  }
}
