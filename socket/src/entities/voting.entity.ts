import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Vote } from './vote.entity'
import { VoteOption } from './vote-option.entity'

@Entity('votings')
export class Voting extends BaseEntity {
  @PrimaryColumn()
  voteId: number

  @PrimaryColumn()
  voteOptionId: number

  @ManyToOne(() => Vote, (vote) => vote.votings)
  @JoinColumn({ name: 'voteId' })
  vote: Vote

  @ManyToOne(() => VoteOption, (voteOption) => voteOption.votings)
  @JoinColumn({ name: 'voteOptionId' })
  voteOption: VoteOption

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
