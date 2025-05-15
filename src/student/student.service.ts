import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
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
    if (!(validPromedio && validSemestre)) {
      throw new BadRequestException();
    }
    const newStudent = await this.studentRepository.save(student);
    return newStudent;
  }

  async eliminarEstudiante(id: bigint): Promise<void> {
    const existingStudent = await this.studentRepository.findOneBy({ id });

    if (existingStudent === null) {
      throw new NotFoundException();
    }

    await this.studentRepository.remove(existingStudent);

    return;
  }

  // create(createStudentDto: CreateStudentDto) {
  //   return 'This action adds a new student';
  // }

  // findAll() {
  //   return `This action returns all student`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} student`;
  // }

  // update(id: number, updateStudentDto: UpdateStudentDto) {
  //   return `This action updates a #${id} student`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} student`;
  // }
}
