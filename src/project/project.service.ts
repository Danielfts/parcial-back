import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  //methods
  async crearProyecto(dto: CreateProjectDto) {
    const { mentorId, studentId, ...data } = dto;
    const project = this.projectRepository.create({ ...data });
    // find relations
    // teacher
    const existingTeacher = await this.teacherRepository.findOneBy({
      id: mentorId,
    });
    if (existingTeacher === null)
      throw new NotFoundException(
        `No se encontró el profesor con id ${mentorId}`,
      );
    // students
    const existingStudent = await this.studentRepository
      .findOneBy({ id: studentId })
      .then((student) => {
        if (student === null)
          throw new NotFoundException(
            `No se encontró el estudiante con id ${studentId}`,
          );
        return student;
      });

    project.mentor = existingTeacher;
    project.student = existingStudent;
    const validPresupuesto = project.presupuesto > 0;
    const validTitulo = project.titulo.length > 15;

    if (!validPresupuesto) {
      throw new BadRequestException('El prespuesto debe ser mayor a 0');
    }
    if (!validTitulo) {
      throw new BadRequestException(
        'La longitud del título debe ser mayor a 15',
      );
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
}
