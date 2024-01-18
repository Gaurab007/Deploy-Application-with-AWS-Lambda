import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class TodosS3 {
    constructor() {
        this.s3 = new S3Client(),
        this.bucketName = process.env.ATTACHMENTS_S3_BUCKET,
        this.urlExpiration = process.env.SIGNED_URL_EXPIRATION
      }
    
      async getAttachmentUrl(attachmentId) {
          const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
          return attachmentUrl
      }
    
      async generateUploadUrl(attachmentId) {
        const s3Params = {
            Bucket: this.bucketName,
            Key: attachmentId,
        };
        const command = new PutObjectCommand(s3Params);
        const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: this.urlExpiration });
        console.log(signedUrl)
        return signedUrl
      }

}