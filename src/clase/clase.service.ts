import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clase } from './entities/clase.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(Clase)
    private claseRepository: Repository<Clase>,
  ) {}

  crearClase(createClaseDto: CreateClaseDto): Promise<Clase> {
    return this.create(createClaseDto);
  }

  findClaseById(id: bigint) {
    return this.findOne(id);
  }

  create(createClaseDto: CreateClaseDto): Promise<Clase> {
    const newClase: Clase = this.claseRepository.create({ ...createClaseDto });
    const codigo = newClase.codigo;
    if (codigo.length !== 10) {
      throw new BadRequestException(
        'La clase debe tener un código de 10 dígitos',
      );
    }
    return this.claseRepository.save(newClase);
  }

  findAll() {
    return `This action returns all clase`;
  }

  findOne(id: bigint): Promise<Clase> {
    return this.claseRepository.findOneByOrFail({ id }).catch((error) => {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`No se encontró la clase con id: ${id}`);
      } else {
        throw new InternalServerErrorException();
      }
    });
  }

  update(id: number, updateClaseDto: UpdateClaseDto) {
    return `This action updates a #${id} clase`;
  }

  remove(id: number) {
    return `This action removes a #${id} clase`;
  }
}
