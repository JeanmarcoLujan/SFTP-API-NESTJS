import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XmlToJsonService } from './services/xml-to-json.service';
import { SftpService } from './services/sftp.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Esto asegura que la configuración esté disponible en todo el módulo
    })
  ],
  controllers: [AppController],
  providers: [AppService, SftpService, XmlToJsonService],
})
export class AppModule {
  constructor() {
    // Carga el archivo .env en process.env utilizando dotenv
    dotenv.config();
  }
}
