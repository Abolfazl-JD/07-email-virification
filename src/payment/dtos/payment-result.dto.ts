import { IsEnum, IsString } from "class-validator"

export enum StatusEnum {
    OK = 'OK',
    NOK = 'NOK'
}
export class PaymentResultDto {
    @IsString()
    Authority: string

    @IsEnum(StatusEnum)
    Status: string
}
