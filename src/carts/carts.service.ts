import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart, CartItem } from '@prisma/client';

@Injectable()
export class CartsService {
    constructor(private prisma: PrismaService) {}

    async addToCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
        // Find the cart by userId
        const cart = await this.prisma.cart.upsert({
          where: { userId },
          update: {},
          create: { userId }
        });
    
        // Upsert the cart item
        return this.prisma.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart.cartId,
              productId
            }
          },
          update: { quantity: { increment: quantity } },
          create: { cartId: cart.cartId, productId, quantity }
        });
      }
}
