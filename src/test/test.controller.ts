import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { EvaluatorIdDto } from './dto/evaluator-id.dto';
import { TeacherService } from '../teacher/teacher.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly teacherService: TeacherService,
  ) {}

  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.crearEvaluacion(createTestDto);
  }

  @Patch(':testId/evaluator')
  asignarEvaluador(
    @Body() evaluatorIdDto: EvaluatorIdDto,
    @Param('testId') testId: string,
  ) {
    return this.teacherService.asignarEvaluador(
      evaluatorIdDto.evaluatorId,
      BigInt(testId),
    );
  }
}
