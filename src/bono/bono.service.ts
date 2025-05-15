import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBonoDto } from './dto/create-bono.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Bono } from './entities/bono.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioService } from '../usuario/usuario.service';
import { UserType } from '../shared/types/UserType';

interface FindAllOptions {
  palabraClave?: string;
  idUsuario?: bigint;
}

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(Bono)
    private bonoRepository: Repository<Bono>,
    @Inject(UsuarioService)
    private userService: UsuarioService,
  ) {}

  /**
   * Se debe validar que el monto no sea vacío, positivo y el usuario debe
   *    tener rol de profesor
   * @param data
   * @returns
   */
  crearBono(data: CreateBonoDto): Promise<Bono> {
    const newBono = this.bonoRepository.create({ ...data });
    const { monto, profesorId } = newBono;
    if (monto <= 0) {
      throw new BadRequestException('El monto del bono debe ser mayor a cero');
    }
    const result = this.userService.findOne(profesorId).then((usuario) => {
      const { rol } = usuario;
      if (rol !== UserType.PROFESOR) {
        throw new BadRequestException('El tipo de usuario debe ser profesor');
      }
      return this.bonoRepository.save(newBono);
    });
    return result;
  }

  findBonoByCodigo(palabraClave: string): Promise<Bono[]> {
    return this.bonoRepository.findBy({ palabraClave });
  }

  findAllBonosByUsuario(userId: bigint): Promise<Bono[]> {
    return this.userService
      .findOne(userId)
      .then((user) => {
        return this.bonoRepository.findBy({ profesorId: user.id });
      })
      .catch((error: unknown) => {
        throw new InternalServerErrorException(error);
      });
  }

  deleteBono(id: bigint): Promise<Bono> {
    return this.bonoRepository
      .findOneByOrFail({ id })
      .then((bono) => {
        return this.bonoRepository.remove(bono);
      })
      .catch((error: unknown) => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`No se encontró el bono con Id : ${id}`);
        }
        throw new InternalServerErrorException(error);
      });
  }

  findAll(options?: FindAllOptions): Promise<Bono[]> {
    if (options === undefined) {
      return this.bonoRepository.find();
    } else if (options.idUsuario) {
      return this.findAllBonosByUsuario(options.idUsuario);
    } else if (options.palabraClave) {
      return this.findBonoByCodigo(options.palabraClave);
    }
    return this.bonoRepository.find();
  }
}
