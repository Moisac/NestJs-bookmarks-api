import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { runInThisContext } from 'vm'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {
    
  } 
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        }
      })

      delete user.password;

      return user;
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError) {
        if(error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }

      throw error
    }
  } 

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email
      }
    })

    if(!user) {
      throw new ForbiddenException('Invalid email or password');
    }

    const pwMatches = await argon.verify(user.password, dto.password);

    if(!pwMatches) {
      throw new ForbiddenException('Invalid email or password');
    }

    delete user.password;
    return user;

  }
}