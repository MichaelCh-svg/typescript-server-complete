import { S3 } from 'aws-sdk'
const BUCKET = "mechbucket1";

export function setS3Image(imageStringEncodedBase64: string, alias: string){
    let decodedImageBuffer = Buffer.from(imageStringEncodedBase64, 'base64');
    let fileName = alias.substring(1) + "_image";
    const s3Params = {
        Bucket: BUCKET,
        // Key: `${Date.now().toString()}-${file.filename}`,
        Key: fileName,
        Body: decodedImageBuffer,
        ContentType: 'image/png',
        ACL: 'public-read',
    }
    let s3 = new S3();
    s3.upload(s3Params, (err: any, data: any) => {
    if (err) {
        throw err;
    }
    })
    return "https://mechbucket1.s3.us-west-2.amazonaws.com/" + fileName;
}