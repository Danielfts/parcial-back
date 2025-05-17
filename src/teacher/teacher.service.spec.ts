import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';

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

  it('should cretate a teacher', async () => {
    const teacherDto: CreateTeacherDto = {
      nombre: faker.person.fullName(),
      extension: 99999,
      numeroCedula: 9999999999,
      esParEvaluador: faker.datatype.boolean(),
      departamento: faker.lorem.word(),
    };
    const createdTeacher = await service.crearProfesor(teacherDto);
    const teacherExists = await repository.existsBy({ id: createdTeacher.id });
    expect(teacherExists).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, mentorias, tests, ...teacherData } =
      createdTeacher;
    expect(teacherData).toEqual(teacherDto);
  });

  it('should not create a teacher with a 10 digit extension', async () => {
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
});
