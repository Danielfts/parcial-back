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
  @Column({ type: 'integer' })
  presupuesto: number;
  @Column({ type: 'smallint' })
  notaFinal: number;
  @Column({ type: 'smallint' })
  estado: number;
  @Column()
  fechaInicio: string;
  @Column()
  fechaFin: string;

  //relations

  // many projects -> one student
  @ManyToOne(() => Student, (student) => student.projects, {
    eager: true,
    cascade: ['insert'],
    nullable: true,
    onDelete: 'SET NULL',
  })
  lider: Student | null;

  // muchos proy -> un teacher
  // mentor
  @ManyToOne(() => Teacher, (teacher) => teacher.mentorias, {
    eager: true,
    cascade: ['insert'],
    nullable: false,
  })
  mentor: Teacher;

  @OneToMany(() => Test, (test) => test.project)
  tests: Test[];
}
