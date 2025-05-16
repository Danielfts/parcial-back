import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { Test } from '../test/entities/test.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {}

  // methods
  async crearProfesor(dto: CreateTeacherDto): Promise<Teacher> {
    const teacher = this.teacherRepository.create({ ...dto });
    const validExtension = teacher.extension.toString().length === 5;
    if (!validExtension) {
      throw new BadRequestException(
        'La extensión debe tener exactamente 5 digitos',
      );
    }
    const newTeacher = await this.teacherRepository.save(teacher);
    return newTeacher;
  }
  async asignarEvaluador(teacherId: bigint, testId: bigint) {
    const teacher = await this.teacherRepository.findOneBy({ id: teacherId });

    const test = await this.testRepository.findOneBy({ id: testId });
    if (test === null) {
      throw new NotFoundException(
        `No se encontró la evaluación con id ${testId}`,
      );
    }
    if (teacher === null) {
      throw new NotFoundException(
        `No se encontró el profesor con id ${teacherId}`,
      );
    }

    const existingTests = teacher.tests;
    if (existingTests.length >= 3) {
      throw new BadRequestException(
        `Un profesor puede tener un máximo de 3 evaluaciones activas`,
      );
    }
    teacher.tests.push(test);
    return await this.teacherRepository.save(teacher);
  }
}
