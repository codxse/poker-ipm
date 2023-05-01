import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Story } from './story.entity'
import { Voting } from './voting.entity'

@Entity('votes')
export class Vote extends BaseEntity {
  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'votedById' })
  votedBy: User

  @ManyToOne(() => Story, (story) => story.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storyId' })
  story: Story

  @OneToMany(() => Voting, (voting) => voting.vote)
  votings: Voting[]

  @PrimaryColumn()
  votedById: number

  @PrimaryColumn()
  storyId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
