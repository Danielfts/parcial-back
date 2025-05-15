import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BonoService } from './bono.service';
import { CreateBonoDto } from './dto/create-bono.dto';

@Controller('bono')
export class BonoController {
  constructor(private readonly bonoService: BonoService) {}

  @Post()
  create(@Body() createBonoDto: CreateBonoDto) {
    return this.bonoService.crearBono(createBonoDto);
  }

  @Get()
  findAll(
    @Query('codigo') palabraClave: string | undefined,
    @Query('idUsuario') idUsuario: bigint | undefined,
  ) {
    return this.bonoService.findAll({ idUsuario, palabraClave });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonoService.deleteBono(BigInt(id));
  }
}
