import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Student } from '../student/entities/student.entity';
import { Project } from '../project/entities/project.entity';
import { Test as TestEntity } from '../test/entities/test.entity';
import { CreateStudentDto } from '../student/dto/create-student.dto';

describe('TeacherService', () => {
  let service: TeacherService;
  let teacherRepository: Repository<Teacher>;
  let studentRepository: Repository<Student>;
  let projectRepository: Repository<Project>;
  let testRepository: Repository<TestEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TeacherService],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<Repository<Teacher>>(
      getRepositoryToken(Teacher),
    );
    studentRepository = module.get(getRepositoryToken(Student));
    projectRepository = module.get(getRepositoryToken(Project));
    testRepository = module.get(getRepositoryToken(TestEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should cretate a teacher', async () => {
    const teacherDto: CreateTeacherDto = {
      nombre: faker.person.fullName(),
      extension: 99999,
      numeroCedula: 9999999999,
      esParEvaluador: faker.datatype.boolean(),
      departamento: faker.lorem.word(),
    };
    const createdTeacher = await service.crearProfesor(teacherDto);
    const teacherExists = await teacherRepository.existsBy({
      id: createdTeacher.id,
    });
    expect(teacherExists).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, mentorias, tests, ...teacherData } =
      createdTeacher;
    expect(teacherData).toEqual(teacherDto);
  });

  it('should not create a teacher with a 6 digit extension', async () => {
    const teacherDto: CreateTeacherDto = {
      nombre: faker.person.fullName(),
      extension: 999999,
      numeroCedula: 9999999999,
      esParEvaluador: faker.datatype.boolean(),
      departamento: faker.lorem.word(),
    };
    try {
      await service.crearProfesor(teacherDto);
      fail('The expected error was not thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should assign an evaluator to a test', async () => {
    // Create a student
    const studentDto: CreateStudentDto = {
      nombre: faker.person.fullName(),
      numeroCedula: generateNDigitNumber(10),
      programa: faker.lorem.word(),
      promedio: 4.5,
      semestre: 4,
    };
    const studentEntity = studentRepository.create(studentDto);
    const createdStudent = await studentRepository.save(studentEntity);

    // Create two teachers
    const generateTeacher = (): CreateTeacherDto => ({
      nombre: faker.person.fullName(),
      departamento: faker.lorem.word(),
      esParEvaluador: faker.datatype.boolean(),
      extension: generateNDigitNumber(5),
      numeroCedula: generateNDigitNumber(10),
    });
    const mentorDto: CreateTeacherDto = generateTeacher();
    const mentorEntity = teacherRepository.create(mentorDto);
    const createdMentor = await teacherRepository.save(mentorEntity);
    const evaluatorDto: CreateTeacherDto = generateTeacher();
    const evaluatorEntity = teacherRepository.create(evaluatorDto);
    const createdEvaluator = await teacherRepository.save(evaluatorEntity);
    // Create a project
    const projectEntity: Partial<Project> = {
      titulo: faker.lorem.word(),
      estado: faker.number.int(4),
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString(),
      notaFinal: faker.number.float(5),
      presupuesto: faker.number.int(100),
      area: faker.lorem.word(),
      lider: createdStudent,
      mentor: createdMentor,
    };
    const createdProject = await projectRepository.save(projectEntity);
    // Create a test
    const testEntity: Partial<TestEntity> = {
      evaluador: null,
      calificacion: faker.number.float(5),
      project: createdProject,
    };
    let createdTest = await testRepository.save(testEntity);
    // test assign an evaluator
    const updatedTeacher = await service.asignarEvaluador(
      createdEvaluator.id,
      createdTest.id,
    );
    expect(updatedTeacher.tests).toHaveLength(1);
    createdTest = await testRepository.findOneOrFail({
      where: { id: createdTest.id },
      relations: ['evaluador'],
    });
    expect(createdTest.evaluador!.id).toEqual(createdEvaluator.id);
  });

  it('should not assign a test an evaluator with 3 or more tests', async () => {
    // Create a student
    const studentDto: CreateStudentDto = {
      nombre: faker.person.fullName(),
      numeroCedula: generateNDigitNumber(10),
      programa: faker.lorem.word(),
      promedio: 4.5,
      semestre: 4,
    };
    const studentEntity = studentRepository.create(studentDto);
    const createdStudent = await studentRepository.save(studentEntity);

    // Create two teachers
    const generateTeacher = (): CreateTeacherDto => ({
      nombre: faker.person.fullName(),
      departamento: faker.lorem.word(),
      esParEvaluador: faker.datatype.boolean(),
      extension: generateNDigitNumber(5),
      numeroCedula: generateNDigitNumber(10),
    });
    const mentorDto: CreateTeacherDto = generateTeacher();
    const mentorEntity = teacherRepository.create(mentorDto);
    const createdMentor = await teacherRepository.save(mentorEntity);
    const evaluatorDto: CreateTeacherDto = generateTeacher();
    const evaluatorEntity = teacherRepository.create(evaluatorDto);
    const createdEvaluator = await teacherRepository.save(evaluatorEntity);
    // Create a project
    const projectEntity: Partial<Project> = {
      titulo: faker.lorem.word(),
      estado: faker.number.int(4),
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString(),
      notaFinal: faker.number.float(5),
      presupuesto: faker.number.int(100),
      area: faker.lorem.word(),
      lider: createdStudent,
      mentor: createdMentor,
    };
    const createdProject = await projectRepository.save(projectEntity);
    // Create a test
    function generateTest(): Partial<TestEntity> {
      return {
        evaluador: null,
        calificacion: faker.number.float(5),
        project: createdProject,
      };
    }
    const testEntities = Array.from({ length: 3 }, () => generateTest());
    const createdTestsPromises = testEntities.map((test) =>
      testRepository.save(test),
    );
    const createdTests = await Promise.all(createdTestsPromises);
    expect(createdTests).toHaveLength(3);
    // test assign three evaluator
    const updatedTeacherPromises = createdTests.map((test) =>
      service.asignarEvaluador(createdEvaluator.id, test.id),
    );
    updatedTeacherPromises.forEach((teacher) => {
      expect(teacher).toBeTruthy();
    });

    // test assigning a fourth evaluator
    const lastTest = await testRepository.save(generateTest());
    await expect(
      service.asignarEvaluador(createdEvaluator.id, lastTest.id),
    ).rejects.toThrow(BadRequestException);
  });

  function generateNDigitNumber(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return faker.number.int({ min, max });
  }
});
