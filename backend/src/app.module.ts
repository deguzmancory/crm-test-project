import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { ContactModule } from './contact/contact.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FollowUpModule } from './followup/followup.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env variables globally
    AuthModule,
    UserModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    AccountModule,
    ContactModule,
    FollowUpModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
