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
import { Story } from './story.entity'
import { Voting } from './voting.entity'

@Entity('votes')
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'votedById' })
  votedBy: User

  @ManyToOne(() => Story)
  @JoinColumn({ name: 'storyId' })
  story: Story

  @OneToMany(() => Voting, (voting) => voting.vote)
  votings: Voting[]

  @Column({ type: 'bigint' })
  votedById: number

  @Column({ type: 'bigint' })
  storyId: number

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
