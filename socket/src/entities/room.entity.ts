import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm'
import { User } from './user.entity'
import { Participant } from './participant.entity'

@Entity('rooms')
export class Room extends BaseEntity {
  @OneToMany(() => Participant, (participant) => participant.room)
  participants: Participant[]

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User | number

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'boolean', default: false })
  isFinished: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
