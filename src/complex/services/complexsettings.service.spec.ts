import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComplexSettings } from '../entities/complexsettings.entity.js';
import { ComplexSettingsService } from './complexsettings.service.js';

describe('ComplexSettingsService', () => {
  let service: ComplexSettingsService;
  const repository = {
    create: vi.fn((settings) => settings),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplexSettingsService,
        {
          provide: getRepositoryToken(ComplexSettings),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ComplexSettingsService>(ComplexSettingsService);
  });

  it('creates settings associated with the complex identified by phId', async () => {
    const settings = {
      phId: '4bf9e646-c121-4f71-bcbb-a50e7eeed3bc',
      lateFeePercentage: 5,
      gracePeriod: 10,
      logo: 'logo.svg',
    };

    await service.create(settings);

    expect(repository.create).toHaveBeenCalledWith({
      lateFeePercentage: 5,
      gracePeriod: 10,
      logo: 'logo.svg',
      complex: { id: settings.phId },
    });
    expect(repository.save).toHaveBeenCalled();
  });

  it('updates the associated complex when phId is provided', async () => {
    const phId = '4bf9e646-c121-4f71-bcbb-a50e7eeed3bc';

    await service.update('settings-id', { phId });

    expect(repository.update).toHaveBeenCalledWith('settings-id', {
      complex: { id: phId },
    });
  });
});
