import { S3 } from 'aws-sdk';
import fs from 'fs';
import mime from 'mime';
import { resolve } from 'path';

import upload from '@config/upload';

import { IStorageProvider } from '../IStorageProvider';

const { AWS_BUCKET, AWS_BUCKET_REGION } = process.env;

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: AWS_BUCKET_REGION,
    });
  }
  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalName);

    await this.client
      .putObject({
        Bucket: `${AWS_BUCKET}/${folder}`,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: mime.getType(originalName),
      })
      .promise();

    await fs.promises.unlink(originalName);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}

export { S3StorageProvider };
