import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ProductsToPruchase {
  @ApiProperty({
    description: 'id of the product',
    type: String,
    required: true,
  })
  @Expose({ name: 'id'})
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'number of products',
    type: Number,
    required: true,
  })
  @Expose({ name: 'number'})
  @IsNumber()
  @IsNotEmpty()
  number: number;
}

export class PurchaseProductDto {
  @ApiProperty({
    description: 'products',
    type: ProductsToPruchase,
    isArray: true,
    required: true,
  })
  @Expose({ name: 'products'})
  @IsArray()
  @IsNotEmpty()
  products: ProductsToPruchase[];
}
