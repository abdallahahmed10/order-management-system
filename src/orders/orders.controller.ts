import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { ApplyCouponDto } from '../dto/orders/apply-coupon.dto';
import { CreateOrderDto } from '../dto/orders/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/orders/update-order-status.dto';

@ApiTags('orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createOrder(@Body() body: CreateOrderDto) {
    return this.ordersService.createOrder(body.userId);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'ID of the order' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of the order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrderById(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderById(+orderId);
  }

  @Put(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'ID of the order' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  updateOrderStatus(@Param('orderId') orderId: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(+orderId, body.status);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of orders' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUserId(+userId);
  }

  @Post('/apply-coupon')
  @ApiOperation({ summary: 'Apply a coupon to an order' })
  @ApiBody({ type: ApplyCouponDto })
  @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
    return this.ordersService.applyCoupon(applyCouponDto.orderId, applyCouponDto.couponCode);
  }
}
