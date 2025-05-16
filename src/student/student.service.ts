import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  // methods
  async crearEstudiante(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create({ ...createStudentDto });
    const validPromedio = student.promedio > 3.2;
    const validSemestre = student.semestre >= 4;
    if (!validPromedio) {
      throw new BadRequestException('El promedio debe ser mayor a 3.2');
    }
    if (!validSemestre) {
      throw new BadRequestException('El semestre debe ser mayor a 4');
    }
    const newStudent = await this.studentRepository.save(student);
    return newStudent;
  }

  async eliminarEstudiante(id: bigint): Promise<void> {
    const existingStudent = await this.studentRepository.findOneBy({ id });

    if (existingStudent === null) {
      throw new NotFoundException(`No se encontro el estudiante con id ${id}`);
    }

    await this.studentRepository.remove(existingStudent);

    return;
  }
}
