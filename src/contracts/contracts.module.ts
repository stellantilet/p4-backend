import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContractsService } from './contracts.service';

@Module({
  imports: [ConfigModule],
  exports: [ContractsService],
  providers: [ContractsService],
})
export class ContractsModule {}
