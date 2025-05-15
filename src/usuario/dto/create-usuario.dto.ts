import { UserType } from '../../shared/types/UserType';

export class CreateUsuarioDto {
  nombre: string;
  numeroCedula: number;
  grupoInvestigacion: string;
  numeroExtension: number;
  rol: UserType;
  idJefe?: bigint;
}
