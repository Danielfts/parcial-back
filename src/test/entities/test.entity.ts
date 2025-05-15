import { Entity } from 'typeorm';
import BaseTimestampsEntity from '../../shared/entities/base-timestamps';

@Entity()
export class Test extends BaseTimestampsEntity {}
