import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StudentService', () => {
  let service: StudentService;
  let repository: Repository<Student>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StudentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get<Repository<Student>>(getRepositoryToken(Student));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
