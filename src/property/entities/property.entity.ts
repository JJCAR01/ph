import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Block } from './block.entity.js';
import { Complex } from '../../complex/entities/complex.entity.js';
import { OwnerPerson } from '../../user/entities/owner.entity.js';
import { FinancialDocument } from '../../financial/entities/financial-document.entity.js';

@Entity('property')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Complex, (complex) => complex.properties, {
    nullable: false,
  })
  @JoinColumn({ name: 'ph_id', referencedColumnName: 'id' })
  complex: Relation<Complex>;

  @RelationId((property: Property) => property.complex)
  phId: string;

  @ManyToOne(() => Block, (block) => block.properties, { nullable: false })
  @JoinColumn({ name: 'block_id', referencedColumnName: 'id' })
  block: Relation<Block>;

  @RelationId((property: Property) => property.block)
  blockId: string;

  @ManyToMany(() => OwnerPerson, (owner) => owner.properties)
  owners: Relation<OwnerPerson[]>;

  @OneToMany(() => FinancialDocument, (document) => document.property)
  financialDocuments: Relation<FinancialDocument[]>;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'decimal',
    name: 'area_m2',
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  areaM2: number;

  @Column({
    type: 'decimal',
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  coefficient: number;
}
