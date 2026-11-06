import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateBlockDto } from '../dto/create-block.dto.js';
import { UpdateBlockDto } from '../dto/update-block.dto.js';
import { BlockService } from '../services/block.service.js';

@Controller('blocks')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blockService.create(createBlockDto);
  }

  @Get()
  findAll() {
    return this.blockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blockService.update(id, updateBlockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockService.remove(id);
  }
}
