import { ApiProperty } from '@nestjs/swagger';

export class RemoveFromCartDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID of the product' })
  productId: number;
}