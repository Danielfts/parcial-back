import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { faker } from '@faker-js/faker/.';
import { CreateProjectDto } from './dto/create-project.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepository: Repository<Project>;
  let studentRepository: Repository<Student>;
  let teacherRepository: Repository<Teacher>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProjectService],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
    teacherRepository = module.get<Repository<Teacher>>(
      getRepositoryToken(Teacher),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create project: positive tests
  // Budget > 0
  // length of title > 15
  it('should create a project', async () => {
    // preconditions for creating a project: a student and a teacher
    const { student, teacher } = await seedDatabase();
    const projectDto: CreateProjectDto = {
      ...generateProject(),
      mentorId: teacher.id,
      studentId: student.id,
    };
    const project = await service.crearProyecto(projectDto);
    const savedProject = await projectRepository.findOneOrFail({
      where: { id: project.id },
      relations: ['mentor', 'lider'],
    });
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedAt,
      lider: savedLider,
      mentor: savedMentor,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tests,
      ...projectData
    } = savedProject;
    expect({
      ...projectData,
      mentorId: savedMentor.id,
      studentId: savedLider!.id,
    }).toEqual(projectDto);
  });
  // Create project: negative tests
  it('should not create a project with a negative budget', async () => {
    const { student, teacher } = await seedDatabase();
    const projectDto: CreateProjectDto = {
      ...generateProject(),
      mentorId: teacher.id,
      studentId: student.id,
      presupuesto: faker.number.int({ min: -100, max: 0 }),
    };
    try {
      await service.crearProyecto(projectDto);
      fail('The expected error was not thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      if (error instanceof BadRequestException) {
        const message = error.message;
        expect(message).toEqual('El prespuesto debe ser mayor a 0');
      }
    }
  });

  it('should not create a project with a title with length <= 15', async () => {
    const { student, teacher } = await seedDatabase();
    const projectDto: CreateProjectDto = {
      ...generateProject(),
      mentorId: teacher.id,
      studentId: student.id,
      titulo: 'titulo corto',
    };
    try {
      await service.crearProyecto(projectDto);
      fail('The expected error was not thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      if (error instanceof BadRequestException) {
        const message = error.message;
        expect(message).toEqual('La longitud del título debe ser mayor a 15');
      }
    }
  });
  // Advance project: positive tests
  // state: integer between 0 and 4
  it('should advance a project', async () => {
    const { student, teacher } = await seedDatabase();
    const projectEntity: Project = projectRepository.create({
      ...generateProject(),
      lider: student,
      mentor: teacher,
    });
    const project = await projectRepository.save(projectEntity);
    for (let i: number = 0; i <= 4; i++) {
      const savedProject = await projectRepository.findOneOrFail({
        where: { id: project.id },
      });
      expect(savedProject.estado).toBe(i);
      if (i === 4) break;
      await service.avanzarProyecto(project.id);
    }
  });
  // Advance project: negative tests
  it('should not advance a project to a value beyond 4', async () => {
    const { student, teacher } = await seedDatabase();
    const projectEntity: Project = projectRepository.create({
      ...generateProject(),
      lider: student,
      mentor: teacher,
      estado: 4,
    });
    const project = await projectRepository.save(projectEntity);
    const savedProject = await projectRepository.findOneOrFail({
      where: { id: project.id },
    });
    expect(savedProject.estado).toBe(4);
    try {
      await service.avanzarProyecto(project.id);
      fail('The expected error was not thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      if (error instanceof BadRequestException) {
        expect(error.message).toEqual('El estado máximo de un proyecto es 4');
      }
    }
  });
  // Find all estudiantes: positive tests
  it('should find all students that work on a project', async () => {
    const { student, teacher } = await seedDatabase();
    const projectEntity: Project = projectRepository.create({
      ...generateProject(),
      lider: student,
      mentor: teacher,
      estado: 4,
    });
    const project = await projectRepository.save(projectEntity);
    const students = await service.findAllEstudiantes(project.id);
    expect(Array.isArray(students)).toBe(true);
    expect(students).toHaveLength(1);
    expect(students.at(0)!.id).toEqual(student.id);
  });
  // Find all estudiantes: negative tests
  it('should not find students for a non existing project', async () => {
    await seedDatabase();
    const projectId = 1;
    try {
      await service.findAllEstudiantes(BigInt(projectId));
      fail('The expected error was not thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      if (error instanceof NotFoundException) {
        expect(error.message).toEqual(
          `No se encontró el proyecto con id ${projectId}`,
        );
      }
    }
  });

  // helper functions
  function generateNDigitNumber(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return faker.number.int({ min, max });
  }

  const generateProject = () => {
    const projectDto = {
      titulo: faker.lorem.words(),
      estado: 0,
      presupuesto: faker.number.int(100),
      notaFinal: faker.number.float(5),
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString(),
      area: faker.lorem.word(),
    };
    return projectDto;
  };

  const seedDatabase = async () => {
    // create a student
    const student: Student = await studentRepository.save({
      nombre: faker.person.fullName(),
      numeroCedula: generateNDigitNumber(10),
      programa: faker.lorem.word(),
      promedio: faker.number.float(5),
      semestre: faker.number.int(10),
    });
    // create a teacher
    const teacher: Teacher = await teacherRepository.save({
      nombre: faker.person.fullName(),
      numeroCedula: generateNDigitNumber(10),
      extension: generateNDigitNumber(5),
      departamento: faker.lorem.word(),
      esParEvaluador: faker.datatype.boolean(),
    });
    return { student, teacher };
  };
});
