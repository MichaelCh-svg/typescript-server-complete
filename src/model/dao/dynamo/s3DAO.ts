import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getEnvValue } from "../../../util/EnvString";

const BUCKET = getEnvValue('BUCKET');
const REGION = getEnvValue('REGION');

export async function setS3Image(imageStringEncodedBase64: string, alias: string){
    // console.log("setS3Image");
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
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try{
        await client.send(c);
        return "https://" + BUCKET + ".s3.us-west-2.amazonaws.com/" + fileName;
    }
    catch(error){
        throw error;
    }
    // finally{
    //     return "https://mechbucket1.s3.us-west-2.amazonaws.com/" + fileName;
    // }
   
}