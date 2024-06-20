import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID of the product' })
  productId: number;

  @ApiProperty({ example: 2, description: 'New quantity of the product' })
  quantity: number;
}