import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { User } from './user.entity'
import { Room } from './room.entity'
import { Vote } from './vote.entity'

@Entity('stories')
export class Story extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room: Room

  @OneToMany(() => Vote, (vote) => vote.story)
  votes: Vote[]

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint' })
  createdById: number

  @Column({ type: 'bigint' })
  roomId: number

  @Column({ type: 'varchar', default: '' })
  title: string

  @Column({ type: 'varchar' })
  url: string

  @Column({ type: 'text', default: '' })
  description: string

  @Column({ type: 'boolean', default: false })
  isFinished: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
