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
import { DocumentItem } from './document-item.entity.js';

@Entity('concept')
export class Concept {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Complex, (complex) => complex.concepts, { nullable: true })
  @JoinColumn({ name: 'ph_id', referencedColumnName: 'id' })
  complex: Relation<Complex> | null;

  @RelationId((concept: Concept) => concept.complex)
  phId: string | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @OneToMany(() => DocumentItem, (item) => item.concept)
  documentItems: Relation<DocumentItem[]>;
}
