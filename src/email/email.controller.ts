import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('email')
export class EmailController {

    constructor(private emailConfirmationService: EmailConfirmationService){}
    
    @Get('confirm-email')
    confirmEmail(@Query('token') token: string) {
        return token
    }

    @Post('confirmation')
    async confirm(@Body() confirmationDto: ConfirmEmailDto) {
        const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationDto.token);
        console.log('email', email)
        return this.emailConfirmationService.confirmEmail(email);
    }

    @UseGuards(AuthorizationGuard)
    @Post('resend-confirmation-link')
    resendConfirmationLink(@Req() req: any) {
        return this.emailConfirmationService.resendConfirmationLink(req.user)
    }
}
