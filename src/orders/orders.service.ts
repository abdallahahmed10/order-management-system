import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Order, OrderItem } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number): Promise<Order> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for the user');
    }

    if (!cart.cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    const total = cart.cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

    try {
      const order = await this.prisma.order.create({
        data: {
          userId,
          status: 'Pending',
          total,
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

  async applyCoupon(orderId: number, couponCode: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { orderItems: { include: { product: true } } }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // this will apply the coupon on the total price of the order but 
    //if give a second coupon code it will apply the discount on the total price of the order again not on the discounted price
    const total = order.orderItems.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    // while in this case the coupon will be applied on the discounted price of the order
    // const total = order.total;

    const newPrice = this.validateAndCalculateDiscount(couponCode, total);

    try {
      const updatedOrder = await this.prisma.order.update({
        where: { orderId },
        data: { total: newPrice }
      }); 

      return updatedOrder;
    } catch (error) {
      throw new ConflictException('Failed to apply coupon to the order');
    }
  }

  private validateAndCalculateDiscount(couponCode: string, total: number): number {
    const discountAmount = +couponCode.split('DISCOUNT')[1];
    if (!discountAmount || discountAmount < 0 || discountAmount > 100 || isNaN(discountAmount)) {
      throw new BadRequestException('Invalid coupon code');
    }

    let newPrice = total - (total * (discountAmount / 100));
    if (newPrice < 0) {
      newPrice = 0;
    }
    return newPrice;
  
  }
}
