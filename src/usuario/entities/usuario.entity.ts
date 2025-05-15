import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';
import { Clase } from '../../clase/entities/clase.entity';
import { Bono } from '../../bono/entities/bono.entity';
import { UserType } from '../../shared/types/UserType';

@Entity({ name: 'usuarios' })
export class Usuario extends BaseTimestampsEntity {
  @Column({ type: 'int2' })
  numeroCedula: number;
  @Column()
  nombre: string;
  @Column()
  grupoInvestigacion: string;
  @Column({ type: 'int2' })
  numeroExtension: number;
  @Column({ type: 'enum', enum: UserType })
  rol: UserType;
  @Column({ name: 'id_jefe', nullable: true })
  idJefe: bigint;

  // Relations
  @ManyToOne(() => Usuario, (jefe: Usuario) => jefe.empleados)
  @JoinColumn({ name: 'id_jefe' })
  jefe: Usuario | null;

  @OneToMany(() => Usuario, (empleado: Usuario) => empleado.jefe)
  empleados: Usuario[];

  // un usuario -> una o muchas clases
  @OneToMany(() => Clase, (clase) => clase.profesor)
  clases: Clase[];

  // un usuario -> muchos o ningun bono
  @OneToMany(() => Bono, (bono) => bono.profesor)
  bonos: Bono[];
}
