import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObjectDocument = ObjectEntity & Document;

@Schema({ timestamps: true })
export class ObjectEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  s3Key: string;
}

export const ObjectSchema = SchemaFactory.createForClass(ObjectEntity);
