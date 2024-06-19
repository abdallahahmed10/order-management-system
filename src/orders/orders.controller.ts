import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
  createOrder(@Body() body: { userId: number }) {
    return this.ordersService.createOrder(body.userId);
  }

  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderById(+orderId);
  }

  @Put(':orderId/status')
  updateOrderStatus(@Param('orderId') orderId: string, @Body() body: { status: string }) {
    return this.ordersService.updateOrderStatus(+orderId, body.status);
  }

  @Get('user/:userId')
  getOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUserId(+userId);
  }
  
}
