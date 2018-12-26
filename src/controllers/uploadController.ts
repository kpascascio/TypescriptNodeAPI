import { Response, Request, NextFunction } from 'express';
import { S3 } from 'aws-sdk';
import { v1 } from 'uuid';
const { ACCESSKEYID, SECRETKEY } = process.env;

const s3 = new S3({
    accessKeyId: ACCESSKEYID,
    secretAccessKey: SECRETKEY
});

// TODO: using dev AWS bucket
export const imageUpload = async (req: Request, res: Response, next: NextFunction) => {
    const key =  `${req.user.uid}/${v1()}.jpeg`;
    s3.getSignedUrl('putObject', {
        Bucket: 'lets-wait-dating-dev',
        ContentType: 'image/jpeg',
        Key: key
    }, (err: Error, url: string) => {
        res.send({err, url, key});
    });
};