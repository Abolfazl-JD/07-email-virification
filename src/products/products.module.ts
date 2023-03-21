import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { Product, ProductSchema } from './product.schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema } ])
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
