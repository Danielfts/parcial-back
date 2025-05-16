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
    const { projectId, evaluatorId, ...data } = createTestDto;
    // find related entities
    const existingProject = await this.projectRepository.findOneBy({
      id: projectId,
    });

    const existingEvaluator = evaluatorId
      ? await this.teacherRepository.findOneBy({
          id: evaluatorId,
        })
      : null;

    if (existingProject === null) {
      throw new NotFoundException(
        `No se encontró el proyecto con id ${projectId}`,
      );
    }

    if (existingEvaluator === null && evaluatorId !== undefined) {
      throw new NotFoundException(
        `No se encontró el profesor con id ${evaluatorId}`,
      );
    }
    const test = this.testRepository.create({ ...data });
    const validCalificacion = test.calificacion > 0 && test.calificacion < 5;
    const mentor = existingProject.mentor;
    const validEvaluador = evaluatorId
      ? BigInt(evaluatorId) !== BigInt(mentor.id)
      : true;
    if (!validCalificacion) {
      throw new BadRequestException(`La calificación debe estar entre 0 y 5`);
    }
    if (!validEvaluador) {
      throw new BadRequestException(
        'El evaluador debe ser diferente del mentor',
      );
    }
    test.evaluador = existingEvaluator;
    test.project = existingProject;
    const newTest = await this.testRepository.save(test);
    const { evaluador: evaluatorData, ...testDto } = newTest;
    const evaluatorDto = { ...evaluatorData };
    delete evaluatorDto?.tests;
    testDto['evaluador'] = evaluatorDto;
    return testDto;
  }
}
