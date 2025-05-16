import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { TeacherModule } from '../teacher/teacher.module';
import { TeacherService } from '../teacher/teacher.service';
import { Teacher } from '../teacher/entities/teacher.entity';
import { Project } from '../project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Test, Teacher, Project]), TeacherModule],
  controllers: [TestController],
  providers: [TestService, TeacherService],
})
export class TestModule {}
