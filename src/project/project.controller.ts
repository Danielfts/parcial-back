import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';

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
}
