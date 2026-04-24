import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';
import { ObjectEntity, ObjectSchema } from './object.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ObjectEntity.name, schema: ObjectSchema },
    ]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, ObjectsGateway],
})
export class ObjectsModule {}
