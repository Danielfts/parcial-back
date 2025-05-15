import { Column, Entity } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';

@Entity()
export class Student extends BaseTimestampsEntity {
  @Column({ type: 'int2' })
  numeroCedula: number;
  @Column()
  nombre: string;

  @Column()
  programa: string;

  @Column()
  promedio: number;
}
