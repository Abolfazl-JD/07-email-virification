import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>

@Schema({ timestamps: true })
export class Product {
    @Prop({
        required: true,
        trim: true
    })
    name: string

    @Prop({
        required: true,
        min: 0.01
    })
    price: number

    @Prop({
        trim: true
    })
    description: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)