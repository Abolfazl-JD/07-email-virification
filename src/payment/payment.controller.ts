import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { AuthorizationGuard } from './../guards/authorization.guard';
import { EmailConfirmationGuard } from './../guards/email-confirmation.guard';
import { PaymentResultDto, StatusEnum } from './dtos/payment-result.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Controller('payment')
export class PaymentController {

    constructor(private paymentService: PaymentService, private httpService: HttpService) { }
    
    @UseGuards(EmailConfirmationGuard)
    @UseGuards(AuthorizationGuard)
    @Post('new')
    async newPayment(
        @Req() req: any,
        @Body('amount') amount: number,
        @Res() res: Response) {
        
        const data = await this.paymentService.requestNewPayment(amount)
        console.log(data.authority)
        console.log(req.user.id)
        if (data.code === 100) {
            const newPaymentReq = await this.paymentService.addNewPayment({
                authorityId: data.authority,
                userId: req.user.id,
                amount
            })
            console.log(`https://www.zarinpal.com/pg/StartPay/${data.authority}`)
            res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.authority}`)
        }
        else  res.redirect('http://localhost:3000/api/v1/products')
    }

    @Get('result')
    async getPayCallback(@Query() paymentResultDetails: PaymentResultDto, @Res() res: Response) {
        if (paymentResultDetails.Status !== StatusEnum.NOK) throw new BadRequestException('transaction unsuccessfull')
        
        const { amount } = await this.paymentService.findPaymentByAuthorityId(paymentResultDetails.Authority)
        const params = {
            merchant_id: "6cded376-3063-11e9-a98e-005056a205be",
            amount,
            authority: paymentResultDetails.Authority
        }
        console.log(JSON.stringify(params))

        const { data: response } = await firstValueFrom(
            this.httpService.post('https://api.zarinpal.com/pg/v4/payment/verify.json', params).pipe(
              catchError((error: AxiosError) => {
                throw error;
              }),
            ),
        )
        console.log('response final data',response.errors.validations)
        return 'can not bleivve'
    }
}
