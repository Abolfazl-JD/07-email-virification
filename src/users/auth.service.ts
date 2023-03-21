import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { genSalt, hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { LoginUserDto } from './dtos/login-user.dto';
import { UserDocument } from './user.schema';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) { }
    
    async handleSignup(userInfo: CreateUserDto) {
        // check if this email isn't in the database
        const user = await this.usersService.findUserByEmail(userInfo.email, false)
        if (user) throw new BadRequestException('account with this email already exists')
        //hash password
        userInfo.password = await this.encryptPassword(userInfo.password)
        // add user to the database
        const newUser = await this.usersService.addUser(userInfo)
        const JWT = this.generateJWT({id: newUser.id, email: newUser.email})
        return { token: JWT, user: { username: newUser.username, email: newUser.email } }
    }

    async handleLogin(userInfo: LoginUserDto) {
        const { email, password: enteredPassword } = userInfo
        // check if this email exists in the database
        const user = await this.usersService.findUserByEmail(email, true)
        if (!user) throw new UnauthorizedException('there is no account with this gmail')
        // check the entered password is correct
        await this.checkPassword(enteredPassword, user.password)
        
        const JWT = this.generateJWT({ id: user.id })
        console.log(JWT)
        return { token: JWT, user : { username: user.username, email: user.email } }
    }

    async encryptPassword(password: string) {
        const salt = await genSalt(10)
        return hash(password, salt)
    }

    generateJWT(info: Partial<UserDocument>) {
        return sign(
            info,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME }
        )
    }

    async checkPassword(passToCheck: string, encryptedPass: string) {
        const isPasswordCorrect = await compare(passToCheck, encryptedPass)
        if(!isPasswordCorrect) throw new UnauthorizedException('password incorrect')
    }
}
