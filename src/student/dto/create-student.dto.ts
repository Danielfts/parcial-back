import { OmitType } from '@nestjs/mapped-types';
import { Student } from '../entities/student.entity';
import { IsInt, IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';

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
  numeroCedula: number;
  @IsNotEmpty()
  @IsString()
  programa: string;
  @IsNotEmpty()
  @IsNumber()
  promedio: number;
}
