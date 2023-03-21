import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';

export type PaymentDocument = HydratedDocument<Payment>

@Schema({ timestamps: true })
export class Payment {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({
        type: String,
        required: true
    })
    authorityId: string

    @Prop({
        type: Number,
        required: true
    })
    amount: number

    @Prop({
        type: Boolean,
        default: false
    })
    done: boolean

}

export const PaymentSchema = SchemaFactory.createForClass(Payment)