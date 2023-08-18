import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { XmlToJsonService } from './services/xml-to-json.service';
import { SftpService } from './services/sftp.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly sftpService: SftpService,
    private readonly xmlToJsonService: XmlToJsonService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/files')
  async getFiles() {
    const conn = await this.sftpService.connectSftp();
    
    const fileList = await this.sftpService.listXmlFiles(conn);


    const jsonFiles = await Promise.all(
      fileList.map(async (filename) => {
        const xmlContent = await this.sftpService.getFileContents(conn, `/TierraHotels/OPERA/${filename}`);
        const jsonContent = await this.xmlToJsonService.convertXmlToJson(xmlContent.toString());
        return { filename, content: jsonContent };
       // return { jsonContent };
      }),
    );

    conn.end();
    return jsonFiles;
  }

  @Post('/move')
  async moveFile(@Body() body: { filename: string }) {
    if (!body.filename) {
      throw new BadRequestException('Filename parameter is required.');
    }

    const conn = await this.sftpService.connectSftp();
    const sourcePath = `/TierraHotels/OPERA/${body.filename}`;
    const targetPath = `/TierraHotels/Procesados/${body.filename}`;

    await this.sftpService.moveFile(conn, sourcePath, targetPath);

    conn.end();
    return { message: 'File moved successfully.' };
  }
}
