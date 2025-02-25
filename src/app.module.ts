import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ControllerModule } from './controller/controller.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exception/exception-manager.filter';

@Module({
  imports: [CommonModule, ControllerModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
