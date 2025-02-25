import { Module } from '@nestjs/common';
import { IUserService } from './user/user.service';
import { UserService } from './user/impl/user.service.impl';
import { DataProviderModule } from '../data-provider/data-provider.module';
import { IProductService } from './product/product.service';
import { ProductService } from './product/impl/product.service.impl';
import { IInvoiceService } from './invoice/invoice.service';
import { InvoiceService } from './invoice/impl/invoice.service.impl';

@Module({
  imports: [DataProviderModule],
  providers: [
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IProductService,
      useClass: ProductService,
    },
    {
      provide: IInvoiceService,
      useClass: InvoiceService,
    },
  ],
  exports: [IUserService, IProductService, IInvoiceService],
})
export class CoreModule {}
