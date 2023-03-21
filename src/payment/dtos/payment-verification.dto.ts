import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class PaymentVerificationDto {
    @IsNotEmpty()
    @IsString()
    merchant_id: string

    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsNotEmpty()
    @IsString()
    authority: string
}