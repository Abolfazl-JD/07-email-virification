import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailService } from './email.service';
import { UsersModule } from './../users/users.module';
import { EmailController } from './email.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule)
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailModule {}
