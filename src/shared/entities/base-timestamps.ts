import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

class BaseTimestampsEntity {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: bigint;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

export default BaseTimestampsEntity;
