import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Test } from '../test/entities/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Test])],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
