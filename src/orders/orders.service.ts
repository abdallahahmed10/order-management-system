import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Order, OrderItem } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async createOrder(userId: number): Promise<Order> {
        const cart = await this.prisma.cart.findUnique({
          where: { userId },
          include: { cartItems: true }
        });
    
        if (!cart || !cart.cartItems.length) throw new Error('Cart is empty');
    
        const order = await this.prisma.order.create({
          data: {
            userId,
            status: 'Pending',
            orderItems: {
              create: cart.cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
              }))
            }
          }
        });
    
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.cartId } });
    
        return order;
      }

      async getOrderById(orderId: number): Promise<Order> {
        return this.prisma.order.findUnique({
          where: { orderId },
          include: { orderItems: { include: { product: true } } }
        });
      }

      async updateOrderStatus(orderId: number, status: string): Promise<Order> {
        return this.prisma.order.update({
          where: { orderId },
          data: { status }
        });
      }

        async getOrdersByUserId(userId: number): Promise<Order[]> {
            return this.prisma.order.findMany({
            where: { userId },
            include: { orderItems: { include: { product: true } } }
            });
        }

}
