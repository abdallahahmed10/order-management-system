import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { OrdersService } from '../orders/orders.service';
import { Order } from '@prisma/client';

@Controller('/api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly ordersService: OrdersService,
      ) {}
    
      @Get(':userId/orders')
      async getUserOrders(@Param('userId') userId: string): Promise<Order[]> {
        const user = await this.usersService.findUserById(+userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return this.ordersService.getOrdersByUserId(+userId);
      }
}
