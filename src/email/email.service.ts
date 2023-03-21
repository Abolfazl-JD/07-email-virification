import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
    private nodemailerTransport: Mail;

    constructor() {
        this.nodemailerTransport = createTransport({
        service: 'gmail',
        auth: {
                user: process.env.ACCOUNT_EMAIL,
                pass: process.env.ACCOUNT_PASS,
            }
        })
    }
    
    sendMail(options: Mail.Options) {
        return this.nodemailerTransport.sendMail(options);
    }
}
