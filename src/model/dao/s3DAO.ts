import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const BUCKET = "mechbucket1";

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
    const client = new S3Client({ region: "us-west-2" });
    try{
        await client.send(c);
        return "https://mechbucket1.s3.us-west-2.amazonaws.com/" + fileName;
    }
    catch(error){
        throw error;
    }
    // finally{
    //     return "https://mechbucket1.s3.us-west-2.amazonaws.com/" + fileName;
    // }
   
}