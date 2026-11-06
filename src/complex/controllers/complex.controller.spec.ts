import { Test, TestingModule } from '@nestjs/testing';
import { ComplexController } from './complex.controller.js';
import { ComplexService } from '../services/complex.service.js';

describe('ComplexController', () => {
  let controller: ComplexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplexController],
      providers: [
        {
          provide: ComplexService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ComplexController>(ComplexController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
