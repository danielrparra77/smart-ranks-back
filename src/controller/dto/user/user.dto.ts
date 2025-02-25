import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'name of the user',
    type: String,
    required: true,
  })
  @Expose({ name: 'name'})
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @ApiProperty({
    description: 'password of the user',
    type: String,
    required: false,
  })
  @Expose({ name: 'password'})
  @IsString()
  password?: string;
}
