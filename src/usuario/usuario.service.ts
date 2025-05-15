import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UserType } from '../shared/types/UserType';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * Crea un usuario con las siguientes validaciones:
   * Si el rol es Profesor se debe validar que el grupo de Investigación
   *  este entre los siguientes valores: TICSW, IMAGINE, COMIT.
   * Si el rol es Decana se
   *  debe validar que el número de extensión sea de 8 dígitos.
   *
   */
  create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const rol = createUsuarioDto.rol;
    const ext = createUsuarioDto.numeroExtension;
    const grupoInvestigacion = createUsuarioDto.grupoInvestigacion;
    const validGruposInvestigacion = ['TICSW', 'IMAGINE', 'COMIT'];
    if (rol === UserType.DECANA) {
      if (ext.toString().length !== 8) {
        throw new BadRequestException(
          'Las decanas deben tener una extensión de 8 digitos',
        );
      }
    } else if (rol === UserType.PROFESOR) {
      const grupoValido = validGruposInvestigacion.includes(grupoInvestigacion);
      if (!grupoValido) {
        throw new BadRequestException(
          `Los profesores deben estar en uno de los siguientes grupos de investigación: ${validGruposInvestigacion.toString()}`,
        );
      }
    }
    const newUser = this.usuarioRepository.create({ ...createUsuarioDto });
    return this.usuarioRepository.save(newUser);
  }

  crearUsuario(createUsuarioDto: CreateUsuarioDto) {
    return this.create(createUsuarioDto);
  }

  findOne(id: bigint): Promise<Usuario> {
    const result = this.usuarioRepository
      .findOne({
        where: {
          id,
        },
      })
      .then((user) => {
        if (user === null) {
          throw new NotFoundException(
            `No se encontró el usuario con Id: ${id}`,
          );
        }
        return user;
      });
    return result;
  }

  findUsuarioById(id: bigint): Promise<Usuario> {
    return this.findOne(id);
  }

  remove(id: bigint) {
    const result = this.usuarioRepository
      .findOneByOrFail({ id })
      .then((user) => {
        return this.usuarioRepository.remove(user);
      })
      .catch((error) => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(
            `No se encontró el usuario con Id: ${id}`,
          );
        } else {
          throw new InternalServerErrorException();
        }
      });

    return result;
  }

  eliminarUsuario(id: bigint) {
    return this.remove(id);
  }
}
