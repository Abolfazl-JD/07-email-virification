import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(private usersService: UsersService){}

    async canActivate(
        context: ExecutionContext,
    ){
            
        const req = context.switchToHttp().getRequest()
        const { authorization: authHeader } = req.headers
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) return false

        const token = authHeader.split(' ')[1]

        try {
            const decoded: any = verify(token, process.env.JWT_SECRET)
            const user = await this.usersService.findUserById(decoded.id, false)
            req.user = user
            return true
        } catch (err) {
            return false
        }
  }
}
