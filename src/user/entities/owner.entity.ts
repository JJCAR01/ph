import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Complex } from '../../complex/entities/complex.entity.js';
import { Property } from '../../property/entities/property.entity.js';

export enum DocumentType {
  CC = 'CC',
  NIT = 'NIT',
  CE = 'CE',
  PASSPORT = 'PASSPORT',
}

@Entity('owner_person')
export class OwnerPerson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Complex, { nullable: false })
  @JoinColumn({ name: 'ph_id', referencedColumnName: 'id' })
  complex: Relation<Complex>;

  @RelationId((owner: OwnerPerson) => owner.complex)
  phId: string;

  @Column({ type: 'enum', enum: DocumentType, name: 'document_type' })
  documentType: DocumentType;

  @Column({ type: 'varchar', length: 50, name: 'document_number' })
  documentNumber: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @ManyToMany(() => Property, (property) => property.owners)
  @JoinTable({
    name: 'property_owner',
    joinColumn: { name: 'owner_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'property_id', referencedColumnName: 'id' },
  })
  properties: Relation<Property[]>;
}
