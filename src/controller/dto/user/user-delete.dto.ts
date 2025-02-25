import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDeleteDto {
  @ApiProperty({
    description: 'email of the user',
    type: String,
    required: true,
  })
  @Expose({ name: 'email'})
  @IsString()
  @IsNotEmpty()
  email: string;
}
