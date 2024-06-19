import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart, CartItem } from '@prisma/client';

@Injectable()
export class CartsService {
    constructor(private prisma: PrismaService) {}

    async addToCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
        const cart = await this.prisma.cart.upsert({
          where: { userId },
          update: {},
          create: { userId }
        });
    
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

      async removeFromCart(userId: number, productId: number): Promise<void> {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
    
        if (!cart) throw new Error('Cart not found');
    
        await this.prisma.cartItem.delete({
          where: { cartId_productId: { cartId: cart.cartId, productId } }
        });
      }


}
