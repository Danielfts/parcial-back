import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CreateStudentDto } from './dto/create-student.dto';

describe('StudentService', () => {
  let service: StudentService;
  let repository: Repository<Student>;

  const seedDatabase = async () => {
    await repository.clear();
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StudentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get<Repository<Student>>(getRepositoryToken(Student));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a student', async () => {
    const studentDto: CreateStudentDto = {
      nombre: faker.person.fullName(),
      numeroCedula: 191359793,
      programa: 'ISIS',
      promedio: 4.5,
      semestre: 9,
    };
    const createdStudent = await service.crearEstudiante(studentDto);
    expect(createdStudent).not.toBeNull();
    expect(createdStudent).toBeInstanceOf(Student);
  });
});
