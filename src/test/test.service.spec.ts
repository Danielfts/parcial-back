import { Test, TestingModule } from '@nestjs/testing';
import { TestService } from './test.service';
import { Test as TestEntity } from './entities/test.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { faker } from '@faker-js/faker/.';
import { Teacher } from '../teacher/entities/teacher.entity';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';
import { Project } from '../project/entities/project.entity';
import { Student } from '../student/entities/student.entity';

describe('TestService', () => {
  let service: TestService;
  let testRepository: Repository<TestEntity>;
  let teacherRepository: Repository<Teacher>;
  let projectRepository: Repository<Project>;
  let studentRepository: Repository<Student>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TestService],
    }).compile();

    service = module.get<TestService>(TestService);
    testRepository = module.get<Repository<TestEntity>>(
      getRepositoryToken(TestEntity),
    );
    teacherRepository = module.get(getRepositoryToken(Teacher));
    projectRepository = module.get(getRepositoryToken(Project));
    studentRepository = module.get(getRepositoryToken(Student));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Create a TestEntity success test
   */
  it('should create a test entity', async () => {
    const generateTeacher = (): CreateTeacherDto => ({
      nombre: faker.person.fullName(),
      departamento: faker.lorem.word(),
      esParEvaluador: faker.datatype.boolean(),
      extension: generateNDigitNumber(5),
      numeroCedula: generateNDigitNumber(10),
    });
    const evaluador: Teacher = await teacherRepository.save(generateTeacher());
    const mentor: Teacher = await teacherRepository.save(generateTeacher());
    const testEntity: Partial<TestEntity> = {
      calificacion: faker.number.float(5),
    };
  });
  /**
   * Create a TestEntity failure test
   */
  it('should not create an invalid test entity', () => {});

  function generateNDigitNumber(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return faker.number.int({ min, max });
  }
});
