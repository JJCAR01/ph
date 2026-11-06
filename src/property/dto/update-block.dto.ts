import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockDto } from './create-block.dto.js';

export class UpdateBlockDto extends PartialType(CreateBlockDto) {}
