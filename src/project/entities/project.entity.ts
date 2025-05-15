import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';
import { Student } from '../../student/entities/student.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Test } from '../../test/entities/test.entity';

@Entity()
export class Project extends BaseTimestampsEntity {
  @Column()
  titulo: string;
  @Column()
  area: string;
  @Column()
  presupuesto: number;
  @Column()
  notaFinal: number;
  @Column()
  estado: number;
  @Column()
  fechaInicio: string;
  @Column()
  fechaFin: string;

  //relations

  // many projects -> one student
  @ManyToOne(() => Student, (student) => student.projects)
  student: Student;

  // muchos proy -> un teacher
  @ManyToOne(() => Teacher, (teacher) => teacher.projects)
  teacher: Teacher;

  @OneToMany(() => Test, (test) => test.project)
  tests: Test[];
}
