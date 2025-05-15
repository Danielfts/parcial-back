import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { CreateClaseDto } from './dto/create-clase.dto';

@Controller('clase')
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  @Post()
  create(@Body() createClaseDto: CreateClaseDto) {
    return this.claseService.crearClase(createClaseDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.claseService.findClaseById(BigInt(id));
  }
}
