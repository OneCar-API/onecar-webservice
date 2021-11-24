import fs from 'fs';
import mime from 'mime';
import { S3 } from 'aws-sdk';
import { resolve } from 'path';
import request from 'request-promise';

import upload from '@config/upload';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: 'us-east-1',
    });
  }

  public async saveLink(
    link: string,
    folder: string,
    fileName: string,
  ): Promise<string> {
    const options = {
      uri: link,
      encoding: null,
    };

    const ContentType = mime.getType(link);

    if (!ContentType) {
      throw new AppError('Could not get content type.', 401);
    }

    const body = await request(options);

    const attachmentAmazon = await this.client
      .upload({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        ACL: 'public-read',
        Key: fileName,
        Body: body,
        ContentType,
      })
      .promise();

    return attachmentAmazon.Location;
  }

  public async saveFile(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalName);

    const ContentType = mime.getType(originalName);

    if (!ContentType) {
      throw new AppError('Could not get content type.', 401);
    }

    await this.client
      .putObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalName);

    return file;
  }

  public async deleteFile(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
