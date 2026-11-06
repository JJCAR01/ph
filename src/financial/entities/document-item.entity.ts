import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Concept } from './concept.entity.js';
import { FinancialDocument } from './financial-document.entity.js';

@Entity('document_item')
export class DocumentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FinancialDocument, (document) => document.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id', referencedColumnName: 'id' })
  document: Relation<FinancialDocument>;

  @RelationId((item: DocumentItem) => item.document)
  documentId: string;

  @ManyToOne(() => Concept, (concept) => concept.documentItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'concept_id', referencedColumnName: 'id' })
  concept: Relation<Concept>;

  @RelationId((item: DocumentItem) => item.concept)
  conceptId: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  amount: number;
}
