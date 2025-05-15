import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoController } from './bono.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bono } from './entities/bono.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bono, Usuario]), UsuarioModule],
  controllers: [BonoController],
  providers: [BonoService, UsuarioService],
})
export class BonoModule {}
