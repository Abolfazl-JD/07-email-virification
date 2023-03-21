import { Body, Controller, Post, forwardRef, Inject } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { EmailConfirmationService } from '../email/email-confirmation.service';

@Controller('users')
export class UsersController {
    
    constructor(
        private authService: AuthService,
        @Inject(forwardRef(() => EmailConfirmationService))
        private emailConfirmationService: EmailConfirmationService
    ) { }
    
    @Post('register')
    async signupUser(@Body() userInfo: CreateUserDto) {
        const user = await this.authService.handleSignup(userInfo)
        await this.emailConfirmationService.sendVerificationLink(user.user.email, user.token)
        return user
    }

    @Post('login')
    loginUser(@Body() userInfo: LoginUserDto) {
        return this.authService.handleLogin(userInfo)
    }
}
