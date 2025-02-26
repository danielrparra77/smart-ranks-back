import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UseFilterrDto {
  @ApiProperty({
    description: '_id of the user',
    type: String,
    required: true,
  })
  @Expose({ name: '_id'})
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: 'email of the user',
    type: String,
    required: true,
  })
  @Expose({ name: 'email'})
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
