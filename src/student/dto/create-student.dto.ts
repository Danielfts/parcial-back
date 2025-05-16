import { OmitType } from '@nestjs/mapped-types';
import { Student } from '../entities/student.entity';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateStudentDto extends OmitType(Student, [
  'id',
  'createdAt',
  'updatedAt',
  'projects',
]) {
  @IsNotEmpty()
  @IsString()
  nombre: string;
  @IsNotEmpty()
  @IsInt()
  @Max(9999999999)
  @Min(0)
  numeroCedula: number;
  @IsNotEmpty()
  @IsString()
  programa: string;
  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(0)
  promedio: number;

  @IsNotEmpty()
  @IsInt()
  @Max(20)
  @Min(1)
  semestre: number;
}
