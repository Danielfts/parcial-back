import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TeacherService', () => {
  let service: TeacherService;
  let repository: Repository<Teacher>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TeacherService],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    repository = module.get<Repository<Teacher>>(getRepositoryToken(Teacher));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
