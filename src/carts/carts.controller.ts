import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddToCartDto } from '../dto/carts/add-to-cart.dto';
import { UpdateCartDto } from '../dto/carts/update-cart.dto';
import { RemoveFromCartDto } from '../dto/carts/remove-from-cart.dto';
import { Cart, CartItem } from '@prisma/client';

@ApiTags('carts')
@Controller('api/cart')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Post('/add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 200, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  addToCart(@Body() data: AddToCartDto): Promise<CartItem> {
    return this.cartsService.addToCart(data.userId, data.productId, data.quantity);
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Get cart by user ID' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of the cart' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  getCartByUserId(@Param('userId') userId: string): Promise<Cart> {
    return this.cartsService.getCartByUserId(+userId);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Update item quantity in cart' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  updateCart(@Body() data: UpdateCartDto): Promise<CartItem> {
    return this.cartsService.updateCart(data.userId, data.productId, data.quantity);
  }

  @Delete('/remove')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiBody({ type: RemoveFromCartDto })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  removeFromCart(@Body() data: RemoveFromCartDto): Promise<String> {
    return this.cartsService.removeFromCart(data.userId, data.productId);
  }
}
