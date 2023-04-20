import {
  Entity,
  BaseEntity,
  Column,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Room } from './room.entity'

export enum JoinAs {
  OBSERVER = 'observer',
  OBSERVABLE = 'observable',
}

@Entity('participants')
export class Participant extends BaseEntity {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  roomId: number

  @Column({ type: 'enum', enum: JoinAs })
  joinAs: JoinAs

  @ManyToOne(() => User, (user) => user.participations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Room, (room) => room.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
