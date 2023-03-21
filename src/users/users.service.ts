import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
    
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findUserById(userId: number, selectPassword: boolean) {
        let user: UserDocument
        if(selectPassword) user = await this.userModel.findById(userId).select('+password')
        else user = await this.userModel.findById(userId)
        return user
    }

    async findUserByEmail(email: string, selectPassword: boolean) {
        if(selectPassword) return this.userModel.findOne({ email }).select('+password')
        else return this.userModel.findOne({ email })
    }

    addUser(userInfo: CreateUserDto) {
        return this.userModel.create(userInfo)
    }

    updateEmailConfirmation(email: string) {
        return this.userModel.findOneAndUpdate(
            { email },
            { emailIsConfirmed: true },
            { new: true, runValidators: true }
        )
    }
}
