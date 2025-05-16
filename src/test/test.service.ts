import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { Repository } from 'typeorm';
import { Project } from '../project/entities/project.entity';
import { Teacher } from '../teacher/entities/teacher.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  //methods
  async crearEvaluacion(createTestDto: CreateTestDto) {
    const { projectId, evaluatorId: evaluadorId, ...data } = createTestDto;
    // find related entities
    const existingProject = await this.projectRepository.findOneBy({
      id: projectId,
    });

    const existingEvaluator = evaluadorId
      ? await this.teacherRepository.findOneBy({
          id: evaluadorId,
        })
      : null;

    if (existingProject === null) {
      throw new NotFoundException(
        `No se encontró el proyecto con id ${projectId}`,
      );
    }

    if (existingEvaluator === null && evaluadorId !== undefined) {
      throw new NotFoundException(
        `No se encontró el profesor con id ${evaluadorId}`,
      );
    }
    const test = this.testRepository.create({ ...data });
    const validCalificacion = test.calificacion > 0 && test.calificacion < 5;
    const mentor = existingProject.mentor;
    const validEvaluador = evaluadorId ? evaluadorId !== mentor.id : true;
    if (!(validCalificacion && validEvaluador)) {
      throw new BadRequestException();
    }
    if (!validCalificacion) {
      throw new BadRequestException(`La calificación debe estar entre 0 y 5`);
    }
    if (!validEvaluador) {
      throw new BadRequestException(
        'El evaluador debe ser diferente del mentor',
      );
    }
    const newTest = await this.testRepository.save(test);
    return newTest;
  }
  //

  // create(createTestDto: CreateTestDto) {
  //   return 'This action adds a new test';
  // }

  // findAll() {
  //   return `This action returns all test`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} test`;
  // }

  // update(id: number, updateTestDto: UpdateTestDto) {
  //   return `This action updates a #${id} test`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} test`;
  // }
}
