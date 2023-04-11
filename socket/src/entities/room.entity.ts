import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './user.entity'

@Entity('rooms')
export class Room extends BaseEntity {
  @ManyToMany(() => User, (user) => user.joins)
  @JoinTable({
    name: 'user_rooms',
    joinColumn: { name: 'roomId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[]

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User

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
