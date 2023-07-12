import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'
import { Vote } from './vote.entity'
import { VoteOption } from './vote-option.entity'

@Entity('votings')
export class Voting extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'bigint', nullable: false })
  votedById: number

  @Column({ type: 'bigint', nullable: false })
  storyId: number

  @Column({ type: 'bigint', nullable: false })
  voteOptionId: number

  @ManyToOne(() => Vote, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'votedById', referencedColumnName: 'votedById' },
    { name: 'storyId', referencedColumnName: 'storyId' },
  ])
  vote: Vote

  @ManyToOne(() => VoteOption, (voteOption) => voteOption.votings)
  @JoinColumn({ name: 'voteOptionId' })
  voteOption: VoteOption

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
