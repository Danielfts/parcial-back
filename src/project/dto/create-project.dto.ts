import { OmitType } from '@nestjs/mapped-types';
import { Project } from '../entities/project.entity';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateProjectDto extends OmitType(Project, [
  'id',
  'createdAt',
  'updatedAt',
  'lider',
  'mentor',
  'tests',
]) {
  @IsNotEmpty()
  @IsString()
  @Length(15, undefined, {
    message: 'El título debe tener mínimo 15 caracteres',
  })
  titulo: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFin: string;

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(4)
  estado: number;

  @IsNotEmpty()
  @IsNumber()
  notaFinal: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'El presupuesto mínimo es 0' })
  presupuesto: number;

  // relationships
  @IsNotEmpty()
  @IsInt()
  mentorId: bigint;

  @IsNotEmpty()
  @IsInt()
  studentId: bigint;
}
