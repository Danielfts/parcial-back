import { OmitType } from '@nestjs/mapped-types';
import { Teacher } from '../entities/teacher.entity';
import { IsBoolean, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateTeacherDto extends OmitType(Teacher, [
  'id',
  'createdAt',
  'updatedAt',
  'tests',
  'mentorias',
]) {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsString()
  @IsNotEmpty()
  departamento: string;
  @IsBoolean()
  @IsNotEmpty()
  esParEvaluador: boolean;
  @IsNotEmpty()
  extension: number;
  @IsNotEmpty()
  @Max(9999999999)
  @Min(0)
  numeroCedula: number;
}
