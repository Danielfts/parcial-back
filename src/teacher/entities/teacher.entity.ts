import { Column, Entity, OneToMany } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';
import { Project } from '../../project/entities/project.entity';
import { Test } from '../../test/entities/test.entity';

@Entity()
export class Teacher extends BaseTimestampsEntity {
  @Column({ type: 'int4' })
  numeroCedula: number;
  @Column()
  nombre: string;
  @Column()
  departamento: string;
  @Column({ type: 'int4' })
  extension: number;
  @Column()
  esParEvaluador: boolean;

  //relations

  // un profe -> muchos proyectos
  @OneToMany(() => Project, (project) => project.mentor)
  mentorias: Project[];

  // Un profesor many tests
  @OneToMany(() => Test, (test) => test.evaluador, {
    cascade: true,
    eager: true,
  })
  tests: Test[];
}
