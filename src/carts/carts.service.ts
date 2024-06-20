import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart, CartItem } from '@prisma/client';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
    try {
      const cart = await this.prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      return this.prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.cartId,
            productId,
          },
        },
        update: { quantity: { increment: quantity } },
        create: { cartId: cart.cartId, productId, quantity },
      });
    } catch (error) {
      throw new BadRequestException('Failed to add item to cart');
    }
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    try {
      await this.prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.cartId, productId } },
      });
    } catch (error) {
      throw new BadRequestException('Failed to remove item from cart');
    }
  }

  async getCartByUserId(userId: number): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async updateCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    try {
      return this.prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.cartId, productId } },
        data: { quantity },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update cart');
    }
  }
}
