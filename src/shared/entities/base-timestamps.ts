import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

class BaseTimestampsEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: bigint;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

export default BaseTimestampsEntity;
