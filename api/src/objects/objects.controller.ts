import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';

@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly objectsGateway: ObjectsGateway,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body('title') title: string,
    @Body('description') description: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!title || !description) {
      throw new BadRequestException('title and description are required');
    }
    if (!file) {
      throw new BadRequestException('image file is required');
    }

    const obj = await this.objectsService.create(title, description, file);
    const plain = obj.toObject();
    this.objectsGateway.emitObjectCreated(plain);
    return plain;
  }

  @Get()
  async findAll() {
    const items = await this.objectsService.findAll();
    return items.map((i) => i.toObject());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const obj = await this.objectsService.findOne(id);
    return obj.toObject();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.objectsService.remove(id);
    this.objectsGateway.emitObjectDeleted(id);
  }
}
