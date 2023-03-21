import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {

    @Prop({
        required: [true, 'please provide a username'],
        minlength: 2,
        maxlength: 30,
        trim: true
    })
    username: string

    @Prop({
        required: [true, 'please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please provide a valid email'
        ],
        unique: true,
        trim: true
    })
    email: string
    
    @Prop({
        required: [true, 'please provide password'],
        minlength: 6,
        trim: true,
        select: false
    })
    password: string

    @Prop({
        default: false,
    })
    emailIsConfirmed: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)