import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// 创建 S3 客户端
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.S3_HOST,
  forcePathStyle: true,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      );
    }

    // 生成唯一的文件名
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    // 将 File 对象转换为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 配置上传参数
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: file.type,
        ACL: ObjectCannedACL.public_read,
    };

    // 上传文件到 S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // 构建文件的公共访问 URL
    const fileUrl = `${process.env.S3_HOST}/${process.env.S3_BUCKET_NAME}/${uniqueFileName}`;

    // 返回上传成功的响应
    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: file.name,
      size: file.size
    });

  } catch (error) {
    console.error('上传错误:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
}