import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Complex } from '../../complex/entities/complex.entity.js';
import { FinancialDocument } from './financial-document.entity.js';

@Entity('document_application')
export class DocumentApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Complex, { nullable: false })
  @JoinColumn({ name: 'ph_id', referencedColumnName: 'id' })
  complex: Relation<Complex>;

  @RelationId((application: DocumentApplication) => application.complex)
  phId: string;

  @ManyToOne(
    () => FinancialDocument,
    (document) => document.debtApplications,
    { nullable: false },
  )
  @JoinColumn({ name: 'debt_document_id', referencedColumnName: 'id' })
  debtDocument: Relation<FinancialDocument>;

  @RelationId((application: DocumentApplication) => application.debtDocument)
  debtDocumentId: string;

  @ManyToOne(
    () => FinancialDocument,
    (document) => document.creditApplications,
    { nullable: false },
  )
  @JoinColumn({ name: 'credit_document_id', referencedColumnName: 'id' })
  creditDocument: Relation<FinancialDocument>;

  @RelationId((application: DocumentApplication) => application.creditDocument)
  creditDocumentId: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'applied_amount',
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  appliedAmount: number;
}
