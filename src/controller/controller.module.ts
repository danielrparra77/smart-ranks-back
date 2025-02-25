import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { CoreModule } from 'src/core/core.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { ProductController } from './product/product.controller';
import { InvoiceController } from './invoice/invoice.controller';

@Module({
  imports: [CoreModule],
  controllers: [UserController, ProductController, InvoiceController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class ControllerModule {}
