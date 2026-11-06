import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Block } from '../../property/entities/block.entity.js';
import { Property } from '../../property/entities/property.entity.js';
import { ComplexSettings } from './complexsettings.entity.js';
import { Concept } from '../../financial/entities/concept.entity.js';

@Entity('complex')
export class Complex {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: false, length: 100 })
    name: string;

    @Column({ type: 'varchar', unique: true, length: 20 })
    nit: string;

    @Column({ type: 'varchar', nullable: true, length: 200 })
    address: string;

    @Column({ type: 'varchar', nullable: true, length: 100 })
    city: string;

    @Column({ type: 'varchar', nullable: true , length: 20 })
    whatsapp: string;

    @Column({ type: 'varchar', nullable: true, length: 20 })
    phone: string;

    @Column({ type: 'varchar', nullable: true, length: 100 })
    email: string;

    @Column({ type: 'boolean', nullable: false, default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => ComplexSettings, (settings) => settings.complex)
    settings: Relation<ComplexSettings>;

    @OneToMany(() => Block, (block) => block.complex)
    blocks: Relation<Block[]>;

    @OneToMany(() => Property, (property) => property.complex)
    properties: Relation<Property[]>;

    @OneToMany(() => Concept, (concept) => concept.complex)
    concepts: Relation<Concept[]>;

}
