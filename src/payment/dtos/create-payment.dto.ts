import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    userId: number;

    @IsNotEmpty()
    @IsString()
    authorityId: string

    @IsNotEmpty()
    @IsNumber()
    amount: number
}