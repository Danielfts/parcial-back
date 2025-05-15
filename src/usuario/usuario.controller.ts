import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.crearUsuario(createUsuarioDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findUsuarioById(BigInt(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.eliminarUsuario(BigInt(id));
  }
}
