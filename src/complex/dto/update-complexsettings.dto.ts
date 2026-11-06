import { PartialType } from '@nestjs/mapped-types';
import { CreateComplexSettingsDto } from './create-complexsettings.dto.js';

export class UpdateComplexSettingsDto extends PartialType(
  CreateComplexSettingsDto,
) {}
