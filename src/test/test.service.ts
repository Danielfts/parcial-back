import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {}

  //methods
  async crearEvaluacion(createTestDto: CreateTestDto) {
    const test = this.testRepository.create({ ...createTestDto });
    const validCalificacion = test.calificacion > 0 && test.calificacion < 5;
    const evaluador = test.evaluador;
    const mentor = test.project.mentor;
    const validEvaluador = !(evaluador.id === mentor.id);
    if (!(validCalificacion && validEvaluador)) {
      throw new BadRequestException();
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
