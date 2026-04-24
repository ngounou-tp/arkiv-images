import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntity, ObjectDocument } from './object.schema';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import * as dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary once at module load
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectEntity.name)
    private objectModel: Model<ObjectDocument>,
  ) {}

  /** Upload a buffer to Cloudinary, returns secure URL + public_id */
  private uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || 'arkiv/objects',
          resource_type: 'image',
          // Auto-generate a unique public_id
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'));
          resolve(result);
        },
      );

      // Pipe the in-memory buffer into the upload stream
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async create(
    title: string,
    description: string,
    file: Express.Multer.File,
  ): Promise<ObjectDocument> {
    const result = await this.uploadToCloudinary(file);

    const obj = new this.objectModel({
      title,
      description,
      imageUrl: result.secure_url,  // HTTPS Cloudinary CDN URL
      s3Key: result.public_id,      // Reuse s3Key field to store Cloudinary public_id
    });

    return obj.save();
  }

  async findAll(): Promise<ObjectDocument[]> {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ObjectDocument> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) throw new NotFoundException(`Object ${id} not found`);
    return obj;
  }

  async remove(id: string): Promise<void> {
    const obj = await this.findOne(id);

    // Delete from Cloudinary using stored public_id
    if (obj.s3Key) {
      try {
        await cloudinary.uploader.destroy(obj.s3Key, { resource_type: 'image' });
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    await this.objectModel.findByIdAndDelete(id).exec();
  }
}
