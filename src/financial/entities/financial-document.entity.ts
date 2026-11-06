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
import { Property } from '../../property/entities/property.entity.js';
import { DocumentApplication } from './document-application.entity.js';
import { DocumentItem } from './document-item.entity.js';

export enum FinancialDocumentType {
  F = 'F',
  ND = 'ND',
  RC = 'RC',
  NC = 'NC',
}

export enum FinancialDocumentStatus {
  ACTIVE = 'ACTIVE',
  ANNULLED = 'ANNULLED',
}

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string | number) => Number(value),
};

@Entity('financial_document')
export class FinancialDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Complex, { nullable: false })
  @JoinColumn({ name: 'ph_id', referencedColumnName: 'id' })
  complex: Relation<Complex>;

  @RelationId((document: FinancialDocument) => document.complex)
  phId: string;

  @ManyToOne(() => Property, (property) => property.financialDocuments, {
    nullable: false,
  })
  @JoinColumn({ name: 'property_id', referencedColumnName: 'id' })
  property: Relation<Property>;

  @RelationId((document: FinancialDocument) => document.property)
  propertyId: string;

  @Column({ type: 'enum', enum: FinancialDocumentType, name: 'document_type' })
  documentType: FinancialDocumentType;

  @Column({ type: 'varchar', length: 100, name: 'document_number' })
  documentNumber: string;

  @Column({ type: 'date', name: 'issue_date' })
  issueDate: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'total_amount',
    transformer: decimalTransformer,
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: FinancialDocumentStatus,
    default: FinancialDocumentStatus.ACTIVE,
  })
  status: FinancialDocumentStatus;

  @OneToMany(() => DocumentItem, (item) => item.document, { cascade: true })
  items: Relation<DocumentItem[]>;

  @OneToMany(
    () => DocumentApplication,
    (application) => application.debtDocument,
  )
  debtApplications: Relation<DocumentApplication[]>;

  @OneToMany(
    () => DocumentApplication,
    (application) => application.creditDocument,
  )
  creditApplications: Relation<DocumentApplication[]>;
}
