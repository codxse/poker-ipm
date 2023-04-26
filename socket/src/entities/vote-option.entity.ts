import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Room } from './room.entity'
import { Voting } from './voting.entity'

@Entity('voteOptions')
export class VoteOption extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room: Room

  @OneToMany(() => Voting, (voting) => voting.voteOption)
  votings: Voting[]

  @Column({ type: 'bigint' })
  roomId: number

  @Column({ type: 'varchar' })
  label: string

  @Column({ type: 'int' })
  value: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
