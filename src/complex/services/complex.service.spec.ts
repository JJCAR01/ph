import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complex } from '../entities/complex.entity.js';
import { ComplexService } from './complex.service.js';

describe('ComplexService', () => {
  let service: ComplexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplexService,
        {
          provide: getRepositoryToken(Complex),
          useValue: {
            create: vi.fn(),
            save: vi.fn(),
            find: vi.fn(),
            findOne: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ComplexService>(ComplexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
