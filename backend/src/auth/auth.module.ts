import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]),
  JwtModule.register({
    secret:process.env.SECRET ||'secretKey123',
    signOptions: { expiresIn: '7d' },
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,RolesGuard],
})
export class AuthModule {}
