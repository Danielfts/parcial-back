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
import { BadRequestException } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';

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
    const { evaluador, project }: { evaluador: Teacher; project: Project } =
      await seedDatabase();
    const testEntity: TestEntity = await testRepository.save({
      calificacion: faker.number.float(5),
      evaluador: evaluador,
      project: project,
    });
    const savedTest = await testRepository.findOneOrFail({
      where: { id: testEntity.id },
      relations: ['evaluador', 'project', 'project.mentor'],
    });
    expect(savedTest.calificacion).toEqual(testEntity.calificacion);
    expect(savedTest.evaluador!.id).toEqual(evaluador.id);
    expect(savedTest.project.id).toEqual(project.id);
    expect(savedTest.project.mentor.id).not.toEqual(savedTest.evaluador!.id);
  });
  /**
   * Create a TestEntity failure test
   */
  it('should not create an invalid test entity (calificacion)', async () => {
    const { evaluador, project } = await seedDatabase();
    const testDto: CreateTestDto = {
      calificacion: faker.number.float({ min: 6, max: 10 }),
      evaluatorId: evaluador.id,
      projectId: project.id,
    };
    const saveOperation = () => service.crearEvaluacion(testDto);
    await expect(saveOperation()).rejects.toThrow(BadRequestException);
  });

  it('should not create an invalid test entity (same mentor and evaluador)', async () => {
    const { mentor, project } = await seedDatabase();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, tests, mentorias, ...mentorClone } = mentor;
    const savedMentorClone = await teacherRepository.save(mentorClone);
    const testDto: CreateTestDto = {
      calificacion: faker.number.float({ min: 6, max: 10 }),
      evaluatorId: savedMentorClone.id,
      projectId: project.id,
    };
    const saveOperation = () => service.crearEvaluacion(testDto);
    await expect(saveOperation()).rejects.toThrow(BadRequestException);
  });

  function generateNDigitNumber(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return faker.number.int({ min, max });
  }
  const generateTeacher = (): CreateTeacherDto => ({
    nombre: faker.person.fullName(),
    departamento: faker.lorem.word(),
    esParEvaluador: faker.datatype.boolean(),
    extension: generateNDigitNumber(5),
    numeroCedula: generateNDigitNumber(10),
  });
  async function seedDatabase(): Promise<{
    evaluador: Teacher;
    project: Project;
    mentor: Teacher;
    student: Student;
  }> {
    const evaluador: Teacher = await teacherRepository.save(generateTeacher());
    const mentor: Teacher = await teacherRepository.save(generateTeacher());
    const student: Student = await studentRepository.save({
      nombre: faker.person.fullName(),
      numeroCedula: generateNDigitNumber(10),
      programa: faker.lorem.word(),
      promedio: faker.number.float(5),
      semestre: faker.number.int(10),
    });
    const project: Project = await projectRepository.save({
      area: faker.lorem.word(),
      estado: faker.number.int(4),
      fechaInicio: new Date().toString(),
      fechaFin: new Date().toString(),
      lider: student,
      mentor: mentor,
      titulo: faker.lorem.word(),
      presupuesto: faker.number.int(100),
      notaFinal: faker.number.float(5),
    });
    return { evaluador, project, mentor, student };
  }
});
