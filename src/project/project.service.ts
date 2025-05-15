import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Student } from '../student/entities/student.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  //methods
  async crearProyecto(dto: CreateProjectDto) {
    const project = this.projectRepository.create({ ...dto });
    const validPresupuesto = project.presupuesto > 0;
    const validTitulo = project.titulo.length > 15;

    if (!(validPresupuesto && validTitulo)) {
      throw new BadRequestException();
    }
    const newProject = await this.projectRepository.save(project);

    return newProject;
  }

  async avanzarProyecto(id: bigint) {
    const project = await this.projectRepository.findOneBy({ id });
    if (project === null) {
      throw new NotFoundException();
    }
    if (project.estado >= 4) {
      throw new BadRequestException();
    }

    project.estado = project.estado + 1;
    void (await this.projectRepository.save(project));
    return;
  }

  async findAllEstudiantes(projectId: bigint): Promise<Student[]> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (project === null) {
      throw new NotFoundException();
    }
    const student: Student = project.student;
    return [student];
  }
  //

  // create(createProjectDto: CreateProjectDto) {
  //   return 'This action adds a new project';
  // }

  // findAll() {
  //   return `This action returns all project`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} project`;
  // }

  // update(id: number, updateProjectDto: UpdateProjectDto) {
  //   return `This action updates a #${id} project`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} project`;
  // }
}
