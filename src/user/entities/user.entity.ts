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
import { UserRole } from './user-role.entity.js';

@Entity('app_user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Complex, { nullable: true })
  @JoinColumn({ name: 'ph_id', referencedColumnName: 'id' })
  complex: Relation<Complex> | null;

  @RelationId((user: User) => user.complex)
  phId: string | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'boolean', name: 'is_actived', default: true })
  isActived: boolean;

  @Column({ type: 'timestamp', name: 'last_login', nullable: true })
  lastLogin: Date | null;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: Relation<UserRole[]>;
}
