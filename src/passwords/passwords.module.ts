import { Module } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';

@Module({
  providers: [PasswordsService],
  exports: [PasswordsService],
  controllers: [PasswordsController],
})
export class PasswordsModule {}
