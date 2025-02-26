import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IUserProvider } from './user/user.provider';
import { UserProvider } from './user/impl/user.provider.impl';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../schema/user.schema';
import { Product, ProductSchema } from '../schema/product.schema';
import { IProductProvider } from './product/product.provider';
import { ProductProvider } from './product/impl/product.provider.impl';
import { Invoice, InvoiceSchema } from '../schema/invoice.schema';
import { IInvoiceProvider } from './invoice/invoice.provider';
import { InvoiceProvider } from './invoice/impl/invoice.provider.impl';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODBCON'),
        dbName: configService.get('DBNAME'),
        autoIndex: true,
      })
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: process.env.USERCOLLECTION,
      },
      {
        name: Product.name,
        schema: ProductSchema,
        collection: process.env.PRODUCTCOLLECTION,
      },
      {
        name: Invoice.name,
        schema: InvoiceSchema,
        collection: process.env.INVOICECOLLECTION,
      },
    ]),
  ],
  providers: [
    {
      provide: IUserProvider,
      useClass: UserProvider,
    },
    {
      provide: IProductProvider,
      useClass: ProductProvider,
    },
    {
      provide: IInvoiceProvider,
      useClass: InvoiceProvider,
    },
  ],
  exports: [IUserProvider, IProductProvider, IInvoiceProvider],
})
export class DataProviderModule {}
