import { Controller, Get, Query } from '@nestjs/common';
import { IInvoiceService } from '../../core/invoice/invoice.service';
import { Roles } from '../../common/decorator/roles.decorator';
import { RoleEnum } from '../../common/enum/role.enum';
import { IInvoice } from '../../core/entity/invoice.entity';

@Controller({path: 'invoice'})
export class InvoiceController {
  constructor(private readonly invoiceService: IInvoiceService) {}

  @Get('ids')
  @Roles([RoleEnum.administrator])
  findAll(): Promise<string[]> {
    return this.invoiceService.findAllInvoicesIds();
  }

  @Get()
  @Roles([RoleEnum.administrator])
  findById(
    @Query('id') id: string,
  ): Promise<IInvoice> {
    return this.invoiceService.findInvoiceById(id);
  }
}
