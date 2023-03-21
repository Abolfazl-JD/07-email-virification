import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }
    
    addProduct(productDetails: CreateProductDto) {
        return this.productModel.create(productDetails)
    }

    findAllProducts() {
        return this.productModel.find({}).sort('createdAt')
    }

    async findOneProductById(productId: number) {
        const product = await this.productModel.findById(productId)
        if (!product) throw new NotFoundException('the product you are looking for was not found')
        return product
    }

    updateProduct(productId: number, updatedProduct: UpdateProductDto) {
        return this.productModel.findByIdAndUpdate(productId, updatedProduct, {
            new: true,
            runValidators: true
        })
    }

    async removeProduct(productId: number) {
        await this.productModel.findByIdAndRemove(productId)
        return { msg: "the product was successfully deleted" }
    }
}
