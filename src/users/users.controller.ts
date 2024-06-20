import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { OrdersService } from '../orders/orders.service';
import { Order } from '@prisma/client';

@ApiTags('users')
@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get(':userId/orders')
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of orders' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserOrders(@Param('userId') userId: string): Promise<Order[]> {
    const user = await this.usersService.findUserById(+userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.ordersService.getOrdersByUserId(+userId);
  }
}
