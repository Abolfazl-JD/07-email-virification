import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from './payment.schema';
import { PaymentService } from './payment.service';
import { UsersModule } from './../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema } ]),
    HttpModule,
    UsersModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
