import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { Payment, PaymentDocument } from './payment.schema';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentVerificationDto } from './dtos/payment-verification.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
        private httpService: HttpService
    ) { }

    async requestNewPayment(amount: number) {
        const paymentBodyParams = {
            merchant_id: "6cded376-3063-11e9-a98e-005056a205be" ,
            amount,
            description: "افزایش اعتبار حساب کاربری ",
            callback_url: "http://localhost:3000/api/v1/payment/result",
        }
        const { data: response } = await firstValueFrom(
            this.httpService.post('https://api.zarinpal.com/pg/v4/payment/request.json', paymentBodyParams).pipe(
              catchError((error: AxiosError) => {
                throw 'An error happened!';
              }),
            ),
        )
        return response.data
    }

    addNewPayment(createPaymentDto: CreatePaymentDto) {
        return this.paymentModel.create(createPaymentDto)
    }

    async findPaymentByAuthorityId(authorityId: string) {
        const payment = await this.paymentModel.findOne({ authorityId })
        if (!payment) throw new NotFoundException('this payment does not exist')
        return payment
    }

    async verifyPayment(paymentVerificationDto: PaymentVerificationDto) {
        console.log(paymentVerificationDto)
        const { data: response } = await firstValueFrom(
            this.httpService.post('https://api.zarinpal.com/pg/v4/payment/verify.json', paymentVerificationDto).pipe(
              catchError((error: AxiosError) => {
                throw error;
              }),
            ),
        )
        console.log(response.data)
        return response.data
    }
}
