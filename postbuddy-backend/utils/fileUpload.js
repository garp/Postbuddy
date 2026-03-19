import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_S3_PUBLIC_BUCKET_NAME;

export const uploadFileToS3 = async (file) => {
  try {
    console.log('Key ==> ', {
      KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
      ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
      BUCKET_NAME: process.env.AWS_S3_PUBLIC_BUCKET_NAME
    })
    const timestamp = Date.now();
    const fileKey = `uploads/${timestamp}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const data = await s3.upload(params).promise();
    return { Key: data.Key, Location: data.Location };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

export const generatePublicS3FileUrl = async (fileKey) => {
  try {
    const timestamp = Date.now(); // Ensure URL uniqueness
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}?t=${timestamp}`;
  } catch (error) {
    console.error("Error generating public S3 file URL:", error);
    throw error;
  }
};
