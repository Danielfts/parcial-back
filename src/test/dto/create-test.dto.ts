import { OmitType } from '@nestjs/mapped-types';
import { Test } from '../entities/test.entity';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTestDto extends OmitType(Test, [
  'id',
  'createdAt',
  'updatedAt',
  'project',
  'evaluador',
]) {
  @IsNotEmpty()
  @IsNumber()
  calificacion: number;

  @IsOptional()
  @IsNumber()
  evaluatorId?: bigint;

  @IsNumber()
  projectId: bigint;
}
