import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StatusEnum } from '../../../common/enum/status.enum';

export class ProductDto {
  @ApiProperty({
    description: 'name of the product',
    type: String,
    required: true,
  })
  @Expose({ name: 'name'})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'description of the product',
    type: String,
    required: true,
  })
  @Expose({ name: 'description'})
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'price of the product',
    type: Number,
    required: true,
  })
  @Expose({ name: 'price'})
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'stock of the product',
    type: Number,
    required: true,
  })
  @Expose({ name: 'stock'})
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'status of the product',
    enum: StatusEnum,
    required: true,
  })
  @Expose({ name: 'status'})
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;
}
