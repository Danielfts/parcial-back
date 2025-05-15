import { Column, Entity, OneToMany } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class Student extends BaseTimestampsEntity {
  @Column({ type: 'int2' })
  numeroCedula: number;
  @Column()
  nombre: string;

  @Column()
  programa: string;

  @Column()
  promedio: number;

  // Relations

  // un estudiante -> muchos proyectos
  @OneToMany(() => Project, (project) => project.student)
  projects: Project[];
}
