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
import { Story } from './story.entity'
import { VoteOption } from './vote-option.entity'

@Entity('rooms')
export class Room extends BaseEntity {
  @OneToMany(() => Participant, (participant) => participant.room)
  participants: Participant[]

  @OneToMany(() => Story, (story) => story.room)
  stories: Story[]

  @OneToMany(() => VoteOption, (voteOption) => voteOption.room)
  voteOptions: VoteOption[]

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint' })
  createdById: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'boolean', default: false })
  isFinished: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
