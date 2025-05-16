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
    if (teacher === null || test === null) {
      throw new NotFoundException();
    }

    const existingTests = teacher.tests;
    if (existingTests.length >= 3) {
      throw new BadRequestException();
    }
    teacher.tests.push(test);
    void (await this.teacherRepository.save(test));
    return;
  }
}
