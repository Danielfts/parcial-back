import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../../student/entities/student.entity';
import { Test } from '../../test/entities/test.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Project } from '../../project/entities/project.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Student, Test, Teacher, Project],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Student, Test, Teacher, Project]),
];
