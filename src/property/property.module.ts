import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyController } from './controllers/property.controller.js';
import { Property } from './entities/property.entity.js';
import { PropertyService } from './services/property.service.js';
import { Block } from './entities/block.entity.js';
import { BlockController } from './controllers/block.controller.js';
import { BlockService } from './services/block.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Property,Block])],
  controllers: [PropertyController, BlockController],
  providers: [PropertyService, BlockService],
  exports: [PropertyService, BlockService],
})
export class PropertyModule {}
