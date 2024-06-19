import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CartsService } from './carts.service';

@Controller('api/cart')
export class CartsController {
    constructor(private cartsService: CartsService) {}

    @Post('/add')
    addToCart(@Body() data: { userId: number, productId: number, quantity: number }) {
        return this.cartsService.addToCart(data.userId, data.productId, data.quantity);
    }

    @Get('/:userId')
    getCartByUserId(@Param('userId') userId: string) {
        return this.cartsService.getCartByUserId(+userId);
    }

    @Put('/update')
    updateCart(@Body() data: { userId: number, productId: number, quantity: number }) {
        return this.cartsService.updateCart(data.userId, data.productId, data.quantity);
    }

    @Delete('/remove')
    removeFromCart(@Body() data: { userId: number, productId: number }) {
        return this.cartsService.removeFromCart(data.userId, data.productId);
    }
}
