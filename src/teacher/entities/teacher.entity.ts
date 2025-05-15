import { Column, Entity } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';

@Entity()
export class Teacher extends BaseTimestampsEntity {
  @Column({ type: 'int2' })
  numeroCedula: number;
  @Column()
  nombre: string;

  @Column()
  departamento: string;
  @Column({ type: 'int2' })
  extension: number;
  @Column()
  esParEvaluador: boolean;
}
