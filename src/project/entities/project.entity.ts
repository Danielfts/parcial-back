import { Column, Entity } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';

@Entity()
export class Project extends BaseTimestampsEntity {
  @Column()
  titulo: string;
  @Column()
  area: string;
  @Column()
  presupuesto: number;
  @Column()
  notaFinal: number;
  @Column()
  estado: number;
  @Column()
  fechaInicio: string;
  @Column()
  fechaFin: string;
}
