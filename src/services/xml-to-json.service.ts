import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

@Injectable()
export class XmlToJsonService {
    /*
  async convertXmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
*/

  async convertXmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser({
            explicitArray: false, // Esto evita que se usen arrays para elementos XML únicos
            explicitRoot: false, // Esto evita que se incluya la raíz XML en el resultado
            mergeAttrs: true,
            attrNameProcessors: [(name) => `@${name}`],
          });

      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}