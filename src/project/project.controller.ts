import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.crearProyecto(createProjectDto);
  }

  // get all students

  @Get(':id/students')
  getStudents(@Param('id') id: string) {
    return this.projectService.findAllEstudiantes(BigInt(id));
  }

  // avanzar project

  @Post(':id/status')
  advanceProject(@Param('id') id: string): Promise<Project> {
    return this.projectService.avanzarProyecto(BigInt(id));
  }
}
