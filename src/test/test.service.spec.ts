import { Test, TestingModule } from '@nestjs/testing';
import { TestService } from './test.service';
import { Test as TestEntity } from './entities/test.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';

describe('TestService', () => {
  let service: TestService;
  let repository: Repository<TestEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TestService],
    }).compile();

    service = module.get<TestService>(TestService);
    repository = module.get<Repository<TestEntity>>(
      getRepositoryToken(TestEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
