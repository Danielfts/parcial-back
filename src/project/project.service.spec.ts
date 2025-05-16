import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { Student } from '../student/entities/student.entity';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { Repository } from 'typeorm';

describe('ProjectService', () => {
  let service: ProjectService;
  let repository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProjectService],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
