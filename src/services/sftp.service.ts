import { Injectable } from '@nestjs/common';
import { SFTPStream } from 'ssh2-streams';
import { Client } from 'ssh2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SftpService {

    constructor(private configService: ConfigService) {}
    
  async connectSftp(): Promise<Client> {
    const conn = new Client();
    
    await new Promise((resolve, reject) => {

      conn.on('ready', () => resolve(conn)).on('error', reject).connect({
        host: this.configService.get<string>('HOST'),
        port: this.configService.get<BigInteger>('PORT'),
        username: this.configService.get<string>('USER_NAME'),
        password: this.configService.get<string>('PASSWORD')
      });
    });

    return conn;
  }

  async getFileContents(conn: Client, filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) reject(err);
        
        sftp.readFile(filePath, (readErr, data) => {
          if (readErr) reject(readErr);
          else resolve(data);
        });
      });
    });
  }

  async moveFile(conn: Client, sourcePath: string, targetPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) reject(err);
        
        sftp.rename(sourcePath, targetPath, renameErr => {
          if (renameErr) reject(renameErr);
          else resolve();
        });
      });
    });
  }

  async listXmlFiles(conn: Client): Promise<string[]> {
    return new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) reject(err);

      

        sftp.readdir('/TierraHotels/OPERA', (readdirErr, list) => {

            
          if (readdirErr) reject(readdirErr);

         

          const xmlFiles = list
            .filter(file => file.filename.endsWith('.xml'))
            .map(file => file.filename);

            

          resolve(xmlFiles);
        });
      });
    });
  }
}
