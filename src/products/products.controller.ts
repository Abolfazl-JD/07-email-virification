import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { EmailConfirmationGuard } from './../guards/email-confirmation.guard';

@UseGuards(EmailConfirmationGuard)
@UseGuards(AuthorizationGuard)
@Controller('products')
export class ProductsController {

    constructor(private productsService: ProductsService){}

    @Post()
    createProduct(@Body() productDetails: CreateProductDto) {
        return this.productsService.addProduct(productDetails)
    }

    @Get()
    getProducts() {
        return this.productsService.findAllProducts()
    }

    @Patch('/:id')
    updateProduct(@Param('id') id: number, @Body() updatedProduct: UpdateProductDto) {
        return this.productsService.updateProduct(id, updatedProduct)
    }

    @Delete('/:id')
    deleteProduct(@Param('id') id: number) {
        return this.productsService.removeProduct(id)
    }
}
