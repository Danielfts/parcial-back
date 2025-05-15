import { Entity, ManyToOne } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';
import { Project } from '../../project/entities/project.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity()
export class Test extends BaseTimestampsEntity {
  //relations

  // many eval -> un proyect

  @ManyToOne(() => Project, (project) => project.tests)
  project: Project;

  // un profesor -> many tests
  @ManyToOne(() => Teacher, (teacher) => teacher.tests)
  teacher: Teacher;
}
