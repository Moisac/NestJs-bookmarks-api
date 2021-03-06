import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwt: JwtService,
    private config:ConfigService
    ) {} 

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        }
      })

      return this.generateToken(user.id, user.email);
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

    return this.generateToken(user.id, user.email);

  }

  async generateToken(userId: number, email: string): Promise<{ access_token: string }> {
    const data = {
      sub: userId,
      email,

    }

    const token = await this.jwt.signAsync(data, {
      expiresIn: '30d',
      secret: this.config.get('JWT_SECRET'),
    })

    return { access_token: token }
  }
}
