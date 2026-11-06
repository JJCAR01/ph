import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { Complex } from './complex.entity.js';

@Entity('complex_settings')
export class ComplexSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'decimal',
    name: 'late_fee_percentage',
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  lateFeePercentage: number;

  @Column({ type: 'integer', name: 'grace_period' })
  gracePeriod: number;

  @Column({ type: 'text' })
  logo: string;

  @OneToOne(() => Complex, (complex) => complex.settings, { nullable: false })
  @JoinColumn({ name: 'ph_id', referencedColumnName: 'id' })
  complex: Relation<Complex>;

  @RelationId((settings: ComplexSettings) => settings.complex)
  phId: string;
}
