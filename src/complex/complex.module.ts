import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplexService } from './services/complex.service.js';
import { ComplexController } from './controllers/complex.controller.js';
import { Complex } from './entities/complex.entity.js';
import { ComplexSettings } from './entities/complexsettings.entity.js';
import { ComplexSettingsService } from './services/complexsettings.service.js';
import { ComplexSettingsController } from './controllers/complexsettings.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Complex, ComplexSettings])],
  controllers: [ComplexController, ComplexSettingsController],
  providers: [ComplexService, ComplexSettingsService],
  exports: [ComplexService, ComplexSettingsService],
})
export class ComplexModule {}
