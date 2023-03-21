import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { EmailModule } from './../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => EmailModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, AuthorizationGuard],
  exports: [UsersService, AuthService]
})
export class UsersModule {}
