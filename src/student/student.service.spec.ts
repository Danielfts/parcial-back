import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CreateStudentDto } from './dto/create-student.dto';
import { BadRequestException } from '@nestjs/common';
import { Project } from '../project/entities/project.entity';
import { Teacher } from '../teacher/entities/teacher.entity';

describe('StudentService', () => {
  let service: StudentService;
  let studentRepository: Repository<Student>;
  let projectRepository: Repository<Project>;
  let teacherRepository: Repository<Teacher>;

  const clearDatabase = async () => {
    const clearPromises = [
      studentRepository.clear(),
      projectRepository.clear(),
      teacherRepository.clear(),
    ];
    await Promise.all(clearPromises);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StudentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
    teacherRepository = module.get<Repository<Teacher>>(
      getRepositoryToken(Teacher),
    );
    await clearDatabase();
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
    const studentEntity = studentRepository.create(studentDto);
    const createdStudent = await studentRepository.save(studentEntity);
    const id = createdStudent.id;
    let exists = await studentRepository.exists({ where: { id } });
    expect(exists).toBe(true);
    await service.eliminarEstudiante(id);
    exists = await studentRepository.exists({ where: { id } });
    expect(exists).toBe(false);
  });

  it('should not create a student with low grades', async () => {
    const studentDto: CreateStudentDto = generateStudent();
    studentDto.promedio = 2.5;
    await expect(service.crearEstudiante(studentDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not create a student from a semester lower than 4', async () => {
    const studentDto: CreateStudentDto = generateStudent();
    studentDto.semestre = 3;
    await expect(service.crearEstudiante(studentDto)).rejects.toThrow(
      BadRequestException,
    );
  });
  // TODO define should not delete student with projects test
});
