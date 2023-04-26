import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { Room } from './room.entity'
import { Participant } from './participant.entity'
import { Story } from './story.entity'
import { Vote } from './vote.entity'

@Entity('users')
export class User extends BaseEntity {
  @OneToMany(() => Participant, (participant) => participant.user)
  participations: Participant[]

  @OneToMany(() => Room, (room) => room.createdBy)
  createdRooms: Room[]

  @OneToMany(() => Story, (story) => story.createdBy)
  createdStories: Story[]

  @OneToMany(() => Vote, (vote) => vote.votedBy)
  votes: Vote[]

  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column({ type: 'varchar', nullable: true })
  lastName: string

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string

  @Column({ type: 'varchar', nullable: true })
  username: string

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string

  @Column({ type: 'boolean', default: false })
  isVerified: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
