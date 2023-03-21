import { Injectable, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { EmailService } from './email.service';
import { AuthService } from '../users/auth.service';
import { UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';


@Injectable()
export class EmailConfirmationService {

    constructor(
        private emailService: EmailService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) { }

    async sendVerificationLink(email: string, token: string) {
        console.log('token', token)
        const url = `http://localhost:3000/api/v1/users/confirm-email?token=${token}`
        console.log('url', url)
        const text = `Welcome to the application. To confirm the email address, click here: ${url}`
        console.log('text', text)

        return this.emailService.sendMail({
            to: email,
            subject: 'Email confirmation',
            text,
        })
    }

    async decodeConfirmationToken(confirmationToken: string) {
        try {
            const decoded: any = verify(confirmationToken, process.env.JWT_SECRET)
            console.log('decoded', decoded)
            if (typeof decoded === 'object' && 'email' in decoded) return decoded.email
            throw new BadRequestException()
        } catch (err) {
            if (err?.name === 'TokenExpiredError') {
                throw new BadRequestException('Email confirmation token expired');
              }
              throw new BadRequestException('Bad confirmation token');
        }
    }

    async confirmEmail(email: string) {
        const user = await this.usersService.findUserByEmail(email, false)
        console.log('user', user)
        if (user.emailIsConfirmed) throw new BadRequestException('Email already confirmed')
        return this.usersService.updateEmailConfirmation(email)
    }

    async resendConfirmationLink(user: UserDocument) {
        console.log('user', user)
        if (user.emailIsConfirmed) throw new BadRequestException('Email already confirmed')
        const { id, email } = user
        const token = this.authService.generateJWT({ id, email })
        console.log('token', token)
        await this.sendVerificationLink(email, token)
    }

}
