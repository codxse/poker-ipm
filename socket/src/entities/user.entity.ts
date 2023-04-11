import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { Room } from './room.entity'

@Entity('users')
export class User extends BaseEntity {
  @ManyToMany(() => Room, (room) => room.users)
  @JoinTable({
    name: 'user_rooms',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roomId', referencedColumnName: 'id' },
  })
  joins: Room[]

  @OneToMany(() => Room, (room) => room.createdBy)
  createdRooms: Room[]

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
}
