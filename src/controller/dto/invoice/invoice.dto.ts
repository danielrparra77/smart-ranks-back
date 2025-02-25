import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class InvoiceDto {
  @ApiProperty({
    description: 'emidail of the INVOICE',
    type: String,
    required: true,
  })
  @Expose({ name: 'id'})
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
