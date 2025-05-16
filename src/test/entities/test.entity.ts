import { Column, Entity, ManyToOne } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';
import { Project } from '../../project/entities/project.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity()
export class Test extends BaseTimestampsEntity {
  //relations
  @Column({ type: 'real' })
  calificacion: number;
  // many eval -> un proyect

  @ManyToOne(() => Project, (project) => project.tests, { eager: true })
  project: Project;

  // un profesor -> many tests
  @ManyToOne(() => Teacher, (teacher) => teacher.tests, { nullable: true })
  evaluador: Teacher | null;
}
