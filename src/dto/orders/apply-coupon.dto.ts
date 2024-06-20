import { ApiProperty } from '@nestjs/swagger';

export class ApplyCouponDto {
  @ApiProperty({ example: 1, description: 'ID of the order' })
  orderId: number;

  @ApiProperty({ example: 'DISCOUNT20', description: 'Coupon code to apply' })
  couponCode: string;
}