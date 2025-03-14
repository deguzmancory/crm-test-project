import { Module } from '@nestjs/common';
import { FollowUpController } from './followup.controller';
import { FollowUpService } from './followup.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FollowUpController],
  providers: [FollowUpService],
})
export class FollowUpModule {}
