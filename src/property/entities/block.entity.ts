import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Complex } from '../../complex/entities/complex.entity.js';
import { Property } from './property.entity.js';

@Entity('block')
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Complex, (complex) => complex.blocks, { nullable: false })
  @JoinColumn({ name: 'ph_id', referencedColumnName: 'id' })
  complex: Relation<Complex>;

  @RelationId((block: Block) => block.complex)
  phId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'integer', name: 'total_floor', nullable: true })
  totalFloor: number | null;

  @Column({ type: 'boolean', name: 'has_elevator', default: false })
  hasElevator: boolean;

  @OneToMany(() => Property, (property) => property.block)
  properties: Relation<Property[]>;
}
