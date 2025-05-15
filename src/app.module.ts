import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  config_schema,
  IConfiguration,
} from './config/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { BonoModule } from './bono/bono.module';
import { ClaseModule } from './clase/clase.module';
import { StudentModule } from './student/student.module';
import { ProjectModule } from './project/project.module';
import { TeacherModule } from './teacher/teacher.module';
import { TestModule } from './test/test.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IConfiguration>) => {
        const db_config: TypeOrmModuleOptions = configService.get('database', {
          infer: true,
        })!;
        return db_config;
      },
    }),
    ConfigModule.forRoot({
      validationSchema: config_schema,
      load: [configuration],
    }),
    UsuarioModule,
    BonoModule,
    ClaseModule,
    StudentModule,
    ProjectModule,
    TeacherModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
