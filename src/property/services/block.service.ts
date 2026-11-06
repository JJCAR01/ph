import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlockDto } from '../dto/create-block.dto.js';
import { UpdateBlockDto } from '../dto/update-block.dto.js';
import { Block } from '../entities/block.entity.js';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private readonly blocksRepository: Repository<Block>,
  ) {}

  create(createBlockDto: CreateBlockDto) {
    const { phId, ...blockData } = createBlockDto;
    const block = this.blocksRepository.create({
      ...blockData,
      complex: { id: phId },
    });
    return this.blocksRepository.save(block);
  }

  findAll() {
    return this.blocksRepository.find({ relations: { complex: true } });
  }

  findOne(id: string) {
    return this.blocksRepository.findOne({
      where: { id },
      relations: { complex: true },
    });
  }

  update(id: string, updateBlockDto: UpdateBlockDto) {
    const { phId, ...blockData } = updateBlockDto;
    return this.blocksRepository.update(id, {
      ...blockData,
      ...(phId === undefined ? {} : { complex: { id: phId } }),
    });
  }

  remove(id: string) {
    return this.blocksRepository.delete(id);
  }
}
