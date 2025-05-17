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
  function generateStudent(): CreateStudentDto {
    return {
      nombre: faker.person.fullName(),
      numeroCedula: 191359793,
      programa: 'ISIS',
      promedio: 4.5,
      semestre: 9,
    };
  }

  it('should create a student', async () => {
    const studentDto: CreateStudentDto = generateStudent();
    const createdStudent = await service.crearEstudiante(studentDto);
    expect(createdStudent).not.toBeNull();
    expect(createdStudent).toBeInstanceOf(Student);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, projects, ...createdData } =
      createdStudent;
    expect(createdData).toEqual(studentDto);
    expect(Number.isInteger(id)).toBe(true);
  });

  it('should delete a student', async () => {
    const studentDto: CreateStudentDto = generateStudent();
    const studentEntity = repository.create(studentDto);
    const createdStudent = await repository.save(studentEntity);
    const id = createdStudent.id;
    let exists = await repository.exists({ where: { id } });
    expect(exists).toBe(true);
    await service.eliminarEstudiante(id);
    exists = await repository.exists({ where: { id } });
    expect(exists).toBe(false);
  });
});
