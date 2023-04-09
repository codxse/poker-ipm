import { Module } from '@nestjs/common'
import { AuthService } from '@app/services/auth.service'
import { UserModule } from '@app/modules/user.module'
import { JwtService as JwtStrategy } from '@app/services/jwt.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { GoogleService } from '@app/services/google.service'
import { AuthController } from '@app/controllers/auth.controller'
import { UserService } from '@app/services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User  } from '@app/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleService, UserService],
})
export class AuthModule {}
