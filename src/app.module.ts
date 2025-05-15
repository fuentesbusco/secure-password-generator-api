import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PasswordsModule } from './passwords/passwords.module';

@Module({
  imports: [PasswordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
