import { Module } from '@nestjs/common'
import { AuthService } from '@app/services/auth.service'
import { UserModule } from '@app/modules/user.module'
import { JwtService } from '@app/services/jwt.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { GoogleService } from '@app/services/google.service'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtService, GoogleService],
  exports: [AuthService, JwtService, PassportModule],
})
export class AuthModule {}
